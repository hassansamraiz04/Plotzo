import express from "express";
import { translateText } from "../controllers/translation.controller.js";
import { translateLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/", translateLimiter, translateText);

export default router;
