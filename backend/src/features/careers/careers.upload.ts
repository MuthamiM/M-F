import fs from "fs/promises";
import crypto from "crypto";
import { pgPool } from "../../db/pgClient";
import { logger } from "../../config/logger";

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

export type DocumentKind = "cv" | "resume";

export interface PendingUpload {
  token: string;
  kind: DocumentKind;
  originalName: string;
  mimeType: string;
  size: number;
  content: Buffer;
  createdAt: Date;
  expiresAt: Date;
}

function mapPendingUpload(row: any): PendingUpload {
  return {
    token: row.token,
    kind: row.kind,
    originalName: row.original_name,
    mimeType: row.mime_type,
    size: row.file_size,
    content: row.content,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  };
}

async function cleanupTempFile(file?: Express.Multer.File) {
  if (!file?.path) return;
  await fs.unlink(file.path).catch(() => {});
}

/**
 * Store one or both documents under short-lived, opaque tokens. The bytes are
 * persisted in Postgres immediately, then the multer temp file is removed.
 */
export async function storePendingUpload(files: {
  cv?: Express.Multer.File;
  resume?: Express.Multer.File;
}): Promise<Record<DocumentKind, PendingUpload | null>> {
  const result: Record<DocumentKind, PendingUpload | null> = {
    cv: null,
    resume: null,
  };

  for (const [kind, file] of [
    ["cv", files.cv],
    ["resume", files.resume],
  ] as const) {
    if (!file) continue;

    const token = crypto.randomBytes(24).toString("hex");
    const content = await fs.readFile(file.path);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    try {
      const insertResult = await pgPool.query(
        `INSERT INTO career_pending_uploads
          (token, kind, original_name, mime_type, file_size, content, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING token, kind, original_name, mime_type, file_size, content, created_at, expires_at`,
        [token, kind, file.originalname, file.mimetype, file.size, content, expiresAt]
      );

      result[kind] = mapPendingUpload(insertResult.rows[0]);
      logger.info("Career document stored in database pending application", {
        token: `${token.slice(0, 8)}...`,
        kind,
      });
    } finally {
      await cleanupTempFile(file);
    }
  }

  return result;
}

/** Read a valid upload without consuming it, so the applicant can still retry. */
export async function getPendingUpload(
  token: string,
  kind?: DocumentKind
): Promise<PendingUpload | null> {
  const params: unknown[] = [token];
  const kindClause = kind ? "AND kind = $2" : "";
  if (kind) params.push(kind);

  const result = await pgPool.query(
    `SELECT token, kind, original_name, mime_type, file_size, content, created_at, expires_at
       FROM career_pending_uploads
      WHERE token = $1
        ${kindClause}
        AND expires_at > NOW()`,
    params
  );

  return result.rows[0] ? mapPendingUpload(result.rows[0]) : null;
}

export async function deletePendingUploads(tokens: string[]) {
  const uniqueTokens = [...new Set(tokens.map((token) => token.trim()).filter(Boolean))];
  if (uniqueTokens.length === 0) return;
  await pgPool.query("DELETE FROM career_pending_uploads WHERE token = ANY($1::text[])", [
    uniqueTokens,
  ]);
}

export async function cleanupExpiredPendingUploads() {
  const result = await pgPool.query(
    "DELETE FROM career_pending_uploads WHERE expires_at <= NOW()"
  );
  if ((result.rowCount ?? 0) > 0) {
    logger.info(`Expired pending career uploads cleaned up: ${result.rowCount}`);
  }
}

setInterval(() => {
  void cleanupExpiredPendingUploads().catch((error) => {
    logger.warn(`Failed to clean up expired career uploads: ${error.message}`);
  });
}, 15 * 60 * 1000);
