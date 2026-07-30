// src/features/auth/auth.routes.ts
// The middleware chain reads top-to-bottom like a checklist:
// rate-limit → validate input → run controller.

import { Router } from "express";
import { loginHandler } from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema } from "./auth.schema";
import { strictRateLimiter } from "../../middleware/rateLimiter.middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  strictRateLimiter,
  validate(loginSchema),
  loginHandler
);
