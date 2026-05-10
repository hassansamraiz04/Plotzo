import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_MS || "") || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || "") || 700,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || "") || 40,
});

export const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.TRANSLATE_RATE_LIMIT_MAX || "") || 20,
});

export const predictionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.PREDICTION_RATE_LIMIT_MAX || "") || 30,
});
