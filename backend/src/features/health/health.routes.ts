// src/features/health/health.routes.ts
// Used by your load balancer / uptime monitor. No auth — must always
// respond, even if downstream dependencies are degraded (report that
// in the body, don't 401/403 the check itself).

import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
