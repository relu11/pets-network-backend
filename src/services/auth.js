import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDocWithId, insertDoc, getDocs } from "./Database";
import { TOKEN_SECRET } from "../config/config";

const generateUserToken = (user) => {
  const token = jwt.sign(user, TOKEN_SECRET);
  return token;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (userData) => {
  const { email, name, password, city } = userData;
  if (!(email && name && password && city)) {
    throw new Error("missing-data");
  }
  const hashedPassword = await hashPassword(password);
  let userDoc = {
    email,
    name,
    password: hashedPassword,
    city,
    timeCreated: new Date(),
  };
  const userCreated = await insertDoc("users", userDoc);
  userDoc = await getDocWithId("users", userCreated.id);
  const token = generateUserToken(userDoc);
  delete userDoc.password;
  return {
    token,
    userDoc,
  };
};

const validatePassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

export const login = async (userData) => {
  const { email, password } = userData;
  if (!(email && password)) {
    throw new Error("missing-data");
  }
  try {
    const userDoc = (await getDocs("users", { email }))[0];
    const passwordValidation = await validatePassword(
      password,
      userDoc.password
    );
    if (passwordValidation) {
      console.log("in");
      delete userDoc.password;
      const token = await generateUserToken(userDoc);
      return { token, userDoc };
    }
    throw Error("invalid-data");
  } catch (err) {
    if (err.error === "not_found" || err.message === "invalid-data") {
      throw Error("invalid-data");
    }
    throw Error("unkown-error");
  }
};

export const getUserFromToken = async (token) => {
  const { _id } = jwt.decode(token);
  if (!_id) {
    throw new Error("invalid-token");
  }
  try {
    const userDoc = await getDocWithId("users", _id);
    return userDoc;
  } catch (err) {
    if (err.error === "not_found") {
      throw Error("not-found");
    }
    throw Error("unkown-error");
  }
};

export const authVaildator = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).send({ success: false, message: "forbidden" });
    }
    return jwt.verify(token, TOKEN_SECRET, (err) => {
      if (err) {
        console.log(err);
        res.status(403).send({ success: false, message: "forbidden" });
      }
      getUserFromToken(token)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((error) => {
          if (error.error === "not-found") {
            res.status(404).send({ success: false, message: "invalid token" });
          } else {
            res.status(403).send({ success: false, message: "forbidden" });
          }
        });
    });
  }
  return res.status(403).send({ success: false, message: "forbidden" });
};

export const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, TOKEN_SECRET, (err) => {
        if (err) {
          console.log(err);
          res.status(403).send({ success: false, message: "forbidden" });
        }
        getUserFromToken(token)
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((error) => {
            console.log(error.message);
            if (error.error === "not-found") {
              res
                .status(404)
                .send({ success: false, message: "invalid token" });
            } else {
              res.status(403).send({ success: false, message: "forbidden" });
            }
          });
      });
    }
  } else {
    next();
  }
};
