// src/features/auth/auth.controller.ts
// Thin: parses request, calls service, shapes response. No business logic here.

import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { LoginInput } from "./auth.schema";

export async function loginHandler(
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err); // → errorHandler.middleware.ts
  }
}
