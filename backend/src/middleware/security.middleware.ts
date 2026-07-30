// src/middleware/security.middleware.ts
// Baseline security headers and request hardening applied to every route.
// This is the "seatbelt" layer — it doesn't replace auth or validation,
// it just closes off common attack classes by default.

import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import { Application } from "express";
import { env } from "../config/env";

const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

export function applySecurityMiddleware(app: Application) {
  // Sets Content-Security-Policy, X-Frame-Options, X-Content-Type-Options,
  // Strict-Transport-Security, and more — sane defaults for an API.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: "same-site" },
    })
  );

  // Only allow requests from our own known frontends — not "*".
  app.use(
    cors({
      origin(origin, callback) {
        // allow same-origin/non-browser requests (no Origin header, e.g. curl, health checks)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );

  // Prevents HTTP Parameter Pollution (e.g. ?id=1&id=2 attacks on query parsing)
  app.use(hpp());

  // Don't leak stack/framework details
  app.disable("x-powered-by");
}
