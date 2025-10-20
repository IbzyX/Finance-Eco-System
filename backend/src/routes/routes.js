import express from "express";
import { checkJwt } from "../middleware/checkJwt.js";

const router = express.Router();

router.get("/profile", checkJwt, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.auth,
  });
});

export default router;