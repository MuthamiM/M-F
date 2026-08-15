// src/middleware/rateLimiter.middleware.ts
// Two tiers: a generous global limit, and a strict one for sensitive routes
// (login, contact form) where abuse is cheap and damaging.

import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please try again later." },
});

export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many attempts, please try again later." },
});
