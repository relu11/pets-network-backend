import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.send("recommendation");
});

export default router;
