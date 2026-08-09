import { logger } from "../config/logger";

const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
let redis: any = null;
let healthy = false;

// Lazy require so the package is optional during dev if install fails
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IORedis = require("ioredis");
  redis = new IORedis(url);
  redis.on("connect", () => {
    healthy = true;
    logger.info(`Connected to Redis at ${url}`);
  });
  redis.on("error", (err: any) => {
    healthy = false;
    logger.warn(`Redis error: ${err.message}`);
  });
} catch (err: any) {
  logger.warn(`ioredis not available or failed to initialize: ${err?.message || err}`);
  redis = null;
  healthy = false;
}

export function isRedisHealthy() {
  return healthy && redis !== null;
}

export async function setTicketRaw(key: string, value: string) {
  if (!isRedisHealthy() || !redis) return;
  try {
    await redis.set(key, value);
  } catch (err: any) {
    logger.warn(`Failed to set redis key ${key}: ${err?.message || err}`);
  }
}

export async function getTicketRaw(key: string) {
  if (!isRedisHealthy() || !redis) return null;
  try {
    return await redis.get(key);
  } catch (err: any) {
    logger.warn(`Failed to get redis key ${key}: ${err?.message || err}`);
    return null;
  }
}

export async function delKey(key: string) {
  if (!isRedisHealthy() || !redis) return;
  try {
    await redis.del(key);
  } catch (err: any) {
    logger.warn(`Failed to delete redis key ${key}: ${err?.message || err}`);
  }
}

export async function getAllTicketKeys() {
  if (!isRedisHealthy() || !redis) return [] as string[];
  try {
    return await redis.keys("ticket:*");
  } catch (err: any) {
    logger.warn(`Failed to list ticket keys: ${err?.message || err}`);
    return [];
  }
}

export async function getAllTicketValues() {
  const keys = await getAllTicketKeys();
  if (!keys.length || !isRedisHealthy() || !redis) return [] as string[];
  try {
    const vals = await redis.mget(...keys);
    return vals.filter(Boolean) as string[];
  } catch (err: any) {
    logger.warn(`Failed to mget ticket keys: ${err?.message || err}`);
    return [];
  }
}

export default redis;
