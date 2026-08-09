import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import { logger } from "../config/logger";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres_secure_password@localhost:5432/mf_db";

export const pgPool = new Pool({
  connectionString,
});

export async function initDb() {
  try {
    const client = await pgPool.connect();
    logger.info("Connected to PostgreSQL database successfully.");
    
    // Read and run init.sql
    const sqlPath = join(__dirname, "init.sql");
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);
    logger.info("PostgreSQL database tables verified/initialized.");
    
    client.release();
  } catch (err: any) {
    logger.error(`PostgreSQL initialization failed: ${err.message}`);
    throw err;
  }
}
