import fs from "fs";
import path from "path";
import { pgPool } from "./pgClient";
import { logger } from "../config/logger";
import { getMimeType } from "../features/uploads/uploads.service";

async function main() {
  logger.info("Starting upload files migration & restore to PostgreSQL...");

  // 1. Ensure table exists
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS public.uploaded_files (
      id bigserial PRIMARY KEY,
      filename text NOT NULL UNIQUE,
      original_name text NOT NULL,
      mime_type text NOT NULL,
      file_size integer NOT NULL,
      content bytea NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_uploaded_files_filename ON public.uploaded_files USING btree (filename);
    CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON public.uploaded_files USING btree (created_at DESC);
  `);

  logger.info("Table public.uploaded_files verified.");

  // 2. Scan uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    logger.warn(`No uploads directory found at ${uploadsDir}`);
    process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir);
  let restored = 0;
  let skipped = 0;

  for (const filename of files) {
    const filePath = path.join(uploadsDir, filename);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const mime = getMimeType(filename);
    const content = fs.readFileSync(filePath);

    try {
      await pgPool.query(
        `INSERT INTO public.uploaded_files (filename, original_name, mime_type, file_size, content)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (filename) DO UPDATE
         SET original_name = EXCLUDED.original_name,
             mime_type = EXCLUDED.mime_type,
             file_size = EXCLUDED.file_size,
             content = EXCLUDED.content`,
        [filename, filename, mime, stat.size, content]
      );
      restored++;
      logger.info(`Restored to DB: ${filename} (${stat.size} bytes)`);
    } catch (err: any) {
      logger.error(`Failed to restore ${filename}: ${err.message}`);
      skipped++;
    }
  }

  const totalInDb = await pgPool.query("SELECT COUNT(*) FROM public.uploaded_files");
  logger.info(`Migration complete! Restored: ${restored}, Skipped: ${skipped}, Total in DB: ${totalInDb.rows[0].count}`);
  await pgPool.end();
}

main().catch((err) => {
  logger.error("Migration failed:", err);
  process.exit(1);
});
