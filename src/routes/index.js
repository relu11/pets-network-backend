import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("response from api");
});

export default router;
