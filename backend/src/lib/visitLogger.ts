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
      "INSERT INTO visits (ip, method, path, status_code, duration_ms, country, city, region, isp, lat, lon, user_agent, referrer, source) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [
        input.ip,
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

export async function logClick(visitIp: string, element: string, page: string) {
  try {
    await pgPool.query(
      "INSERT INTO clicks (visit_ip, element, page) VALUES ($1,$2,$3)",
      [visitIp, element, page]
    );
  } catch (err) {
    logger.error("failed to write click log: " + (err as Error).message);
  }
}
