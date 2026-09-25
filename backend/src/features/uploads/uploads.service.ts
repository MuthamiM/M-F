import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { pgPool } from "../../db/pgClient";
import { logger } from "../../config/logger";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || "application/octet-stream";
}

export interface UploadedFileRecord {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  content: Buffer;
  created_at: Date;
}

export async function saveUploadedFileToDb(
  filename: string,
  originalName: string,
  mimeType: string,
  fileSize: number,
  content: Buffer
): Promise<void> {
  await pgPool.query(
    `INSERT INTO uploaded_files (filename, original_name, mime_type, file_size, content)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (filename) DO UPDATE
     SET original_name = EXCLUDED.original_name,
         mime_type = EXCLUDED.mime_type,
         file_size = EXCLUDED.file_size,
         content = EXCLUDED.content`,
    [filename, originalName, mimeType, fileSize, content]
  );
  logger.info(`Persisted file in Postgres database: ${filename} (${fileSize} bytes)`);
}

export async function getUploadedFileFromDb(filename: string): Promise<{ mime_type: string; content: Buffer } | null> {
  const result = await pgPool.query(
    "SELECT mime_type, content FROM uploaded_files WHERE filename = $1",
    [filename]
  );
  if (result.rows.length === 0) return null;
  return {
    mime_type: result.rows[0].mime_type,
    content: result.rows[0].content,
  };
}

export async function serveUploadedFileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawParam = req.params.filename;
    const rawFilename = Array.isArray(rawParam) ? rawParam[0] : rawParam;
    if (!rawFilename || rawFilename.includes("..") || rawFilename.includes("/")) {
      res.status(400).send("Invalid filename");
      return;
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    const localPath = path.join(uploadDir, rawFilename);

    // 1. Check local disk cache
    if (fs.existsSync(localPath)) {
      const mime = getMimeType(localPath);
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(localPath);
    }

    // 2. Fetch from PostgreSQL bytea
    const dbFile = await getUploadedFileFromDb(rawFilename);
    if (dbFile) {
      // Asynchronously restore to disk cache so subsequent requests hit disk
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFile(localPath, dbFile.content, (err) => {
          if (err) logger.warn(`Failed to write disk cache for ${rawFilename}: ${err.message}`);
        });
      } catch {}

      res.setHeader("Content-Type", dbFile.mime_type);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(dbFile.content);
    }

    res.status(404).send("File not found");
  } catch (err) {
    next(err);
  }
}

/**
 * Scan a directory on disk and restore all files into Postgres if they are missing from the DB
 */
export async function restoreUploadedFilesFromDisk(directoryPath: string): Promise<number> {
  if (!fs.existsSync(directoryPath)) {
    return 0;
  }

  const files = fs.readdirSync(directoryPath);
  let restoredCount = 0;

  for (const filename of files) {
    const filePath = path.join(directoryPath, filename);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const mime = getMimeType(filename);
    const content = fs.readFileSync(filePath);

    await saveUploadedFileToDb(
      filename,
      filename,
      mime,
      stat.size,
      content
    );
    restoredCount++;
  }

  logger.info(`Restored ${restoredCount} uploaded files from disk into PostgreSQL database`);
  return restoredCount;
}
