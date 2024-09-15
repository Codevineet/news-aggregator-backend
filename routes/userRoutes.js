import express from "express";
import { addInterest, removeInterest } from "../controllers/userController.js"; 
import { authenticateToken } from "../config/auth.js";

const router = express.Router();
router.post("/interests", authenticateToken, addInterest);
router.delete("/interests", authenticateToken, removeInterest);

export default router;
