import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import { logger } from "../config/logger";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres_secure_password@127.0.0.1:5432/mf_db";

export const pgPool = new Pool({
  connectionString,
  ssl: false,
  max: parseInt(process.env.PG_POOL_MAX || "50", 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  maxUses: 7500,
});

pgPool.on("error", (err) => {
  logger.error(`Unexpected PostgreSQL pool client error: ${err.message}`);
});

export async function initDb() {
  try {
    const client = await pgPool.connect();
    logger.info("Connected to PostgreSQL database successfully.");
    
    // Read and run init.sql (support both dist/ and src/ locations)
    let sqlPath = join(__dirname, "init.sql");
    const { existsSync } = await import("fs");
    if (!existsSync(sqlPath)) {
      const fallbackPath = join(process.cwd(), "src", "db", "init.sql");
      if (existsSync(fallbackPath)) {
        sqlPath = fallbackPath;
      }
    }
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);
    logger.info("PostgreSQL database tables verified/initialized.");
    
    client.release();
  } catch (err: any) {
    logger.error(`PostgreSQL initialization failed: ${err.message}`);
    throw err;
  }
}
