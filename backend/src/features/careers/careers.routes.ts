// src/features/careers/careers.routes.ts
import { Router } from "express";
import {
  uploadDocumentsHandler,
  submitApplicationHandler,
} from "./careers.controller";
import { strictRateLimiter } from "../../middleware/rateLimiter.middleware";
import { uploadMiddleware } from "../../middleware/upload.middleware";

export const careersRouter = Router();

/**
 * POST /api/careers/upload
 * Saves a selected CV or résumé immediately and returns a 30-minute token.
 */
careersRouter.post(
  "/upload",
  strictRateLimiter,
  uploadMiddleware.fields([
    { name: "cv", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  uploadDocumentsHandler
);

/**
 * POST /api/careers/apply
 * Submits application details and claims the pending CV/résumé tokens.
 */
careersRouter.post("/apply", strictRateLimiter, submitApplicationHandler);
