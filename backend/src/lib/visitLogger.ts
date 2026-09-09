import { pgPool } from "../db/pgClient";
import { logger } from "../config/logger";

export interface GeoInfo {
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  lat?: number;
  lon?: number;
}

interface GeoApiResponse {
  status: string;
  country?: string;
  regionName?: string;
  city?: string;
  isp?: string;
  lat?: number;
  lon?: number;
}

const geoCache = new Map<string, GeoInfo>();
const PRIVATE_IP_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|localhost)/;

export async function lookupGeo(ip: string): Promise<GeoInfo> {
  if (ip.length === 0 || PRIVATE_IP_RE.test(ip)) return {};
  if (geoCache.has(ip)) return geoCache.get(ip)!;

  try {
    const res = await fetch(
      "http://ip-api.com/json/" + ip + "?fields=status,country,regionName,city,isp,lat,lon"
    );
    const data = (await res.json()) as GeoApiResponse;
    if (data.status !== "success") return {};

    const geo: GeoInfo = {
      country: data.country,
      region: data.regionName,
      city: data.city,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon,
    };
    geoCache.set(ip, geo);
    return geo;
  } catch (err) {
    logger.warn("geo lookup failed for " + ip + ": " + (err as Error).message);
    return {};
  }
}

export interface VisitLogInput {
  ip: string;
  visitorId?: string;
  cookieConsent?: string;
  method: string;
  path: string;
  statusCode?: number;
  durationMs?: number;
  userAgent?: string;
  referrer?: string;
  source?: "backend" | "frontend";
}

export async function logVisit(input: VisitLogInput) {
  const geo = await lookupGeo(input.ip);

  try {
    await pgPool.query(
      "INSERT INTO visits (ip, visitor_id, cookie_consent, method, path, status_code, duration_ms, country, city, region, isp, lat, lon, user_agent, referrer, source) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)",
      [
        input.ip,
        input.visitorId ?? null,
        input.cookieConsent ?? null,
        input.method,
        input.path,
        input.statusCode ?? null,
        input.durationMs ?? null,
        geo.country ?? null,
        geo.city ?? null,
        geo.region ?? null,
        geo.isp ?? null,
        geo.lat ?? null,
        geo.lon ?? null,
        input.userAgent ?? null,
        input.referrer ?? null,
        input.source ?? "backend",
      ]
    );
  } catch (err) {
    logger.error("failed to write visit log: " + (err as Error).message);
  }
}

export async function logClick(visitIp: string, element: string, page: string, visitorId?: string) {
  try {
    await pgPool.query(
      "INSERT INTO clicks (visit_ip, visitor_id, element, page) VALUES ($1,$2,$3,$4)",
      [visitIp, visitorId ?? null, element, page]
    );
  } catch (err) {
    logger.error("failed to write click log: " + (err as Error).message);
  }
}

export interface CookieConsentInput {
  ip: string;
  visitorId?: string;
  consentMode: "all" | "declined" | "custom";
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  userAgent?: string;
}

export async function logCookieConsent(input: CookieConsentInput) {
  const geo = await lookupGeo(input.ip);

  try {
    await pgPool.query(
      "INSERT INTO cookie_consents (ip, visitor_id, consent_mode, analytics_enabled, marketing_enabled, user_agent, country, city) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [
        input.ip,
        input.visitorId ?? null,
        input.consentMode,
        input.analyticsEnabled,
        input.marketingEnabled,
        input.userAgent ?? null,
        geo.country ?? null,
        geo.city ?? null,
      ]
    );
  } catch (err) {
    logger.error("failed to write cookie consent log: " + (err as Error).message);
  }
}
