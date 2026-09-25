import { Router } from "express";
import { logClick, logVisit, logCookieConsent } from "../../lib/visitLogger";

export const trackingRouter = Router();

trackingRouter.post("/click", (req, res) => {
  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const { element, page, visitorId } = req.body ?? {};
  logClick(ip, element ?? "unknown", page ?? "unknown", visitorId);
  res.status(204).end();
});

trackingRouter.post("/page-view", (req, res) => {
  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const { page, referrer, visitorId, cookieConsent } = req.body ?? {};
  logVisit({
    ip,
    visitorId,
    cookieConsent,
    method: "GET",
    path: page ?? "unknown",
    userAgent: req.headers["user-agent"] as string,
    referrer: referrer ?? (req.headers["referer"] as string),
    source: "frontend",
  });
  res.status(204).end();
});

trackingRouter.post("/consent", (req, res) => {
  const ip =
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const { visitorId, consentMode, analyticsEnabled, marketingEnabled } = req.body ?? {};
  logCookieConsent({
    ip,
    visitorId,
    consentMode: consentMode || "all",
    analyticsEnabled: analyticsEnabled ?? true,
    marketingEnabled: marketingEnabled ?? false,
    userAgent: req.headers["user-agent"] as string,
  });
  res.status(204).end();
});
