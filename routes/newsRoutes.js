import express from "express";
import {
  getNews,
  searchNews,
  getNewsByInterest,
} from "../controllers/newsController.js";
import { authenticateToken } from "../config/auth.js";

const router = express.Router();

router.get("/", getNews);
router.get("/interests", authenticateToken, getNewsByInterest);
router.get("/search", searchNews);

export default router;
