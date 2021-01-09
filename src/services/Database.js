import Cloudant from "@cloudant/cloudant";
import dotenv from "dotenv";

const vcap = require("../config/vcap-local.json");

dotenv.config();

const cloudant = Cloudant({
  // eslint-disable-line
  url: vcap.services.cloudantNoSQLDB.credentials.url,
  plugins: {
    iamauth: {
      iamApiKey: vcap.services.cloudantNoSQLDB.credentials.apikey,
    },
  },
});

export const insertDoc = async (collection, doc) => {
  const db = cloudant.db.use(collection);
  const result = await db.insert(doc);
  return result;
};

export const insertBulk = async (collection, docs) => {
  const db = cloudant.db.use(collection);
  const result = await db.bulk({ docs });
  return result;
};

export const getDocWithId = async (collection, docId) => {
  const db = cloudant.db.use(collection);
  const result = await db.get(docId);
  return result;
};

export const getDocs = async (collection, condition) => {
  const db = cloudant.db.use(collection);
  const result = await db.find({ selector: condition });
  return result.docs;
};

export const getAll = async (collection) => {
  const db = cloudant.db.use(collection);
  const result = await db.list({ include_docs: true });
  const docs = result.rows.map((r) => r.doc);
  return docs;
};

export const deleteDoc = async (collection, docId) => {
  const db = cloudant.db.use(collection);
  const doc = await getDocWithId(collection, docId);
  const result = await db.destroy(doc._id, doc._rev);
  return result;
};
