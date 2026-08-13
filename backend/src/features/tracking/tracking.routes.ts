import { Router } from "express";
import { logClick, logVisit } from "../../lib/visitLogger";

export const trackingRouter = Router();

trackingRouter.post("/click", (req, res) => {
  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const { element, page } = req.body ?? {};
  logClick(ip, element ?? "unknown", page ?? "unknown");
  res.status(204).end();
});

trackingRouter.post("/page-view", (req, res) => {
  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const { page, referrer } = req.body ?? {};
  logVisit({
    ip,
    method: "GET",
    path: page ?? "unknown",
    userAgent: req.headers["user-agent"] as string,
    referrer: referrer ?? (req.headers["referer"] as string),
    source: "frontend",
  });
  res.status(204).end();
});
