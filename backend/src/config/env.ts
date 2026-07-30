// src/config/env.ts
// Centralized, validated environment configuration.
// Nothing in the app should read process.env directly outside this file —
// that way a missing/malformed env var fails fast at boot, not mid-request.

import "dotenv/config";
import { z } from "zod";


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Comma-separated list of allowed origins for CORS, e.g. "https://mftechnologies.com,https://docs.mftechnologies.com"
  ALLOWED_ORIGINS: z.string().min(1, "ALLOWED_ORIGINS must be set"),

  // Secrets — no defaults, ever. Boot fails if these are missing.
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),

// Rate limiting
