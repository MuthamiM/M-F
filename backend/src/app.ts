// src/app.ts
// Assembles the Express app: global middleware first, then feature routers,
// then the error handler last (Express requires this order).

import express from "express";
import { applySecurityMiddleware } from "./middleware/security.middleware";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { healthRouter } from "./features/health/health.routes";
import { authRouter } from "./features/auth/auth.routes";
import { contactRouter } from "./features/contact/contact.routes";
import { docsRouter } from "./features/docs/docs.routes";

export function createApp() {
  const app = express();

  // ── Global middleware ─────────────────────────────────────────────────
  applySecurityMiddleware(app);
  app.use(express.json({ limit: "10kb" }));
  app.use(globalRateLimiter);

  // ── Feature routes ────────────────────────────────────────────────────
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/docs", docsRouter);

  // ── Error handler (must be last) ──────────────────────────────────────
  app.use(errorHandler);

  return app;
}
