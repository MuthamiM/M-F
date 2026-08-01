// src/middleware/errorHandler.middleware.ts
// Single place all errors funnel through. Two jobs:
// 1. Never leak stack traces / internals to the client in production.
// 2. Always log the full error server-side so it's debuggable.

import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { isProd } from "../config/env";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Internal server error";

  logger.error(err.message, {
    statusCode,
    stack: err.stack,
    details: err instanceof AppError ? err.details : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
