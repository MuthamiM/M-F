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
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  logger.error(err.message, {
    path: req.path,
    method: req.method,
    statusCode,
    stack: err.stack,
  });

  // Operational errors (expected, e.g. "not found") are safe to show as-is.
  // Unexpected/programmer errors get a generic message in production so we
  // never leak internals (file paths, SQL, library versions) to a client.
  res.status(statusCode).json({
    error: isOperational || !isProd ? err.message : "Something went wrong. Please try again.",
  });
}

// Catches requests to routes that don't exist
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}
