// src/config/logger.ts
// Structured JSON logging — plain console.log doesn't scale once you have
// more than one server instance and need to search/aggregate logs.

import winston from "winston";
import { isProd } from "./env";

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    isProd
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  transports: [new winston.transports.Console()],
});
