// src/middleware/security.middleware.ts
// Baseline security headers and request hardening applied to every route.

import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { env } from "../config/env";
import { Express } from "express";

export function applySecurityMiddleware(app: Express) {
  // CORS — only allow listed origins
  const origins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: origins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );

  // Helmet — sets various HTTP security headers
  app.use(helmet());

  // HPP — prevent HTTP parameter pollution
  app.use(hpp());
}
