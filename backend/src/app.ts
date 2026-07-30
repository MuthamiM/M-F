// src/app.ts
// Assembles the Express app: global middleware first, then feature routers,
// then the error handler last (Express requires this order).

import express from "express";
import { applySecurityMiddleware } from "./middleware/security.middleware";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.middleware";
import { logger } from "./config/logger";

import { authRouter } from "./features/auth/auth.routes";
import { contactRouter } from "./features/contact/contact.routes";
import { healthRouter } from "./features/health/health.routes";
import { docsRouter } from "./features/docs/docs.routes";

export function createApp() {
  const app = express();

  // --- Global middleware ---
  applySecurityMiddleware(app);
  app.use(express.json({ limit: "10kb" })); // small limit — this API doesn't need large payloads
  app.use(globalRateLimiter);

  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.path}`, { ip: req.ip });
    next();
  });

  // --- Feature routes ---
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/docs", docsRouter);

  // --- Fallbacks (order matters: 404 handler, then error handler, last) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
