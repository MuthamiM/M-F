// src/features/status/status.routes.ts

import { Router, Request, Response } from "express";
import { getLivePlatformStatus } from "./status.service";

export const statusRouter = Router();

statusRouter.get("/", (_req: Request, res: Response) => {
  try {
    const statusData = getLivePlatformStatus();
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).json({
      success: true,
      data: statusData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve platform status",
    });
  }
});

statusRouter.get("/ping", (_req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.status(200).json({
    pong: true,
    timestamp: Date.now(),
  });
});
