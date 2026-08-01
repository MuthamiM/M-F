// src/features/auth/auth.controller.ts
// Thin: parses request, calls service, shapes response. No business logic here.

import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { LoginInput } from "./auth.schema";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
