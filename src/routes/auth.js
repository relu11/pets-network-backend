import { Router } from "express";
import fetch from "node-fetch";
import { createUser, login, authVaildator } from "../services/auth";

const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  if (!(body.email && body.name && body.password && body.city)) {
    return res.status(400).send({ message: "missing data" });
  }
  try {
    const user = await createUser(req.body);
    return res.send({ success: true, user: user.userDoc, token: user.token });
  } catch (err) {
    console.log(err.message);
    console.log(err.stack);
    return res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const body = req.body;
  if (!(body.email && body.password)) {
    return res.status(400).send({ message: "missing data" });
  }
  try {
    const user = await login(req.body);
    return res.send({ success: true, user: user.userDoc, token: user.token });
  } catch (err) {
    switch (err.message) {
      case "invalid-data": {
        return res.status(401).send({ message: "invalid data" });
      }
      default: {
        console.log(err.message);
        return res.status(500).send();
      }
    }
  }
});

router.get("/validate", authVaildator, async (req, res) => {
  res.send({ user: req.user });
});

export default router;
