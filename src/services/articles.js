import {
  deleteDoc,
  getAll,
  getDocs,
  getDocWithId,
  insertDoc,
} from "./Database";

export const addArticle = async (creatorId, newArticleData) => {
  console.log(newArticleData);
  const newArticle = { ...newArticleData, creatorId };
  const articleDoc = await insertDoc("articles", newArticle);
  console.log(newArticle);
  return articleDoc;
};

export const getAllArticles = async () => {
  const articles = await getDocs("articles", { approved: true });
  console.log("Articles Services:", articles);
  return articles;
};

export const getMyArticles = async (userId) => {
  const articles = await getDocs("articles", { creatorId: userId });
  console.log("Article services:", articles);
  return articles;
};

export const editArticle = async (userId, articleId, newArticleData) => {
  const articleDoc = await getDocWithId("articles", articleId);
  if (articleDoc.creatorId !== userId) {
    throw new Error("unauthorized");
  }
  const newArticleDoc = { ...articleDoc, ...newArticleData };

  console.log(newArticleDoc);
  const result = await insertDoc("articles", newArticleDoc);
  return result;
};

export const deleteArticle = async (userId, articleId) => {
  const articleDoc = await getDocWithId("articles", articleId);
  if (articleDoc.creatorId !== userId) {
    throw new Error("unauthorized");
  }
  const result = await deleteDoc("articles", articleId);
  return result;
};
