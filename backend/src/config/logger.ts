// src/config/logger.ts
// Structured JSON logging — plain console.log doesn't scale once you have
// more than one server instance and need to search/aggregate logs.

import winston from "winston";
import { isProd } from "./env";

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ""
            }`
        )
      ),
  transports: [new winston.transports.Console()],
});

// Never let logger calls leak secrets — helper to redact common sensitive keys
const SENSITIVE_KEYS = ["password", "token", "authorization", "jwt", "secret"];

export function redact(obj: Record<string, unknown>) {
  const clone = { ...obj };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clone[key] = "[REDACTED]";
    }
  }
  return clone;
}
