// src/middleware/rateLimiter.middleware.ts
// Two tiers: a generous global limit, and a strict one for sensitive routes
// (login, contact form) where abuse is cheap and damaging (credential
// stuffing, spam) if left unthrottled.

import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", { ip: req.ip, path: req.path });
    res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  },
});

// Tighter limit for auth + contact endpoints — these are the classic
// brute-force / spam targets.
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Strict rate limit exceeded", { ip: req.ip, path: req.path });
    res.status(429).json({
      error: "Too many attempts. Please wait before trying again.",
    });
  },
});
