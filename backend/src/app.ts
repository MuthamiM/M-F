// src/app.ts
// Assembles the Express app: global middleware first, then feature routers,
// then the error handler last (Express requires this order).

import express from "express";
import path from "path";
import { applySecurityMiddleware } from "./middleware/security.middleware";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { healthRouter } from "./features/health/health.routes";
import { statusRouter } from "./features/status/status.routes";
import { authRouter } from "./features/auth/auth.routes";
import { contactRouter } from "./features/contact/contact.routes";
import { docsRouter } from "./features/docs/docs.routes";
import { ticketsRouter } from "./features/tickets/tickets.routes";
import { trackingRouter } from "./features/tracking/tracking.routes";
import { chatbotRouter } from "./features/chatbot/chatbot.routes";
import { v1Router } from "./features/api-v1/v1.routes";
import { careersRouter } from "./features/careers/careers.routes";

export function createApp() {
  const app = express();

  // Behind Cloudflare Tunnel → trust one proxy hop so express-rate-limit
  // can read X-Forwarded-For without throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
  app.set("trust proxy", 1);

  // ── Global middleware ─────────────────────────────────────────────────
  applySecurityMiddleware(app);
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Health and Status routes (unlimited for monitoring/uptime probes)
  app.use("/api/health", healthRouter);
  app.use("/api/status", statusRouter);

  app.use(globalRateLimiter);

  // Request Logging Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const { logger } = require("./config/logger");
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
      // /api/track/* logs its own visits/clicks explicitly with accurate
      // page + source — skip the generic write here or every hit double-logs.
      if (req.originalUrl.startsWith("/api/track")) return;


      const ip =
        (req.headers["cf-connecting-ip"] as string) ||
        (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "unknown";

      const { logVisit } = require("./lib/visitLogger");
      logVisit({
        ip,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
        userAgent: req.headers["user-agent"] as string,
        referrer: req.headers["referer"] as string,
        source: "backend",
      });
    });
    next();
  });

  // ── Feature routes ────────────────────────────────────────────────────
  app.use("/api/auth", authRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/docs", docsRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/api/track", trackingRouter);
  app.use("/api/chatbot", chatbotRouter);
  app.use("/api/v1", v1Router);
  app.use("/v1", v1Router);
  app.use("/api/careers", careersRouter);

  // ── Error handler (must be last) ──────────────────────────────────────
  app.use(errorHandler);

  return app;
}
