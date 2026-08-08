// src/middleware/security.middleware.ts
// Baseline security headers and request hardening applied to every route.

import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import { env } from "../config/env";
import { Express } from "express";

export function applySecurityMiddleware(app: Express) {
  // CORS — dynamically allow listed origins and local subnet IPs for mobile testing
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const origins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
        const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin);
        if (origins.includes(origin) || isLocal || env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );

  // Helmet — sets various HTTP security headers
  app.use(helmet());

  // HPP — prevent HTTP parameter pollution
  app.use(hpp());
}
