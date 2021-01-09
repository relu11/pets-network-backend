import { Router } from "express";
import { authVaildator } from "../services/auth";
import {
  addArticle,
  deleteArticle,
  editArticle,
  getAllArticles,
  getMyArticles,
} from "../services/articles";

const router = Router();

router.get("/", async (req, res) => {
  const articles = await getAllArticles();
  res.send({ success: true, articles });
});

router.get("/my", authVaildator, async (req, res) => {
  const id = req.user._id;
  const articles = await getMyArticles(id);
  res.send({ success: true, articles });
});

router.post("/", authVaildator, async (req, res) => {
  const id = req.user._id;
  const { newArticle } = req.body;
  try {
    await addArticle(id, newArticle);
    console.log("Added Article", newArticle);
    res.send({ success: true, article: newArticle });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.put("/:articleId", authVaildator, async (req, res) => {
  const { article } = req.body;
  const { articleId } = req.params;
  try {
    const result = await editArticle(req.user._id, articleId, article);
    res.send({ success: true, result });
  } catch (err) {
    if (err.message === "unauthorized") {
      res.status(401).send({ success: false, message: "not the owner" });
    } else if (err.error === "not_found") {
      res.status(404).send({ success: false, message: "article not found" });
    } else {
      res.status(500).send({ success: false, message: err.message });
    }
  }
});

router.delete("/:articleId", authVaildator, async (req, res) => {
  const { articleId } = req.params;
  try {
    const result = await deleteArticle(req.user._id, articleId);
    res.send({ success: true, result });
  } catch (err) {
    if (err.message === "unauthorized") {
      res.status(401).send({ success: false, message: "not the owner" });
    } else if (err.error === "not_found") {
      res.status(404).send({ success: false, message: "article not found" });
    } else {
      res.status(500).send({ success: false, message: err.message });
    }
  }
});

export default router;
