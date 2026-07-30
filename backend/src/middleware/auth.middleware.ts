// src/middleware/auth.middleware.ts
// Verifies a Bearer JWT and attaches the decoded user to req.user.
// Fails closed: any missing/invalid/expired token is a 401, no exceptions.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { logger } from "../config/logger";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: string };
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    logger.warn("JWT verification failed", { reason: (err as Error).message });
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Role-based guard — compose after requireAuth, e.g.:
// router.delete("/users/:id", requireAuth, requireRole("admin"), handler)
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
