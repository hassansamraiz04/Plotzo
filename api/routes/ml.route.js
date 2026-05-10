import express from "express";
import {
  predictorHealth,
  predictPrice,
} from "../controllers/ml.controller.js";
import { predictionLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/predict", predictionLimiter, predictPrice);
router.get("/health", predictorHealth);

export default router;
