import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("✅ Server is alive");
});

export default router;
