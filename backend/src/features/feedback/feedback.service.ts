// src/features/feedback/feedback.service.ts
import { pgPool } from "../../db/pgClient";
import { CreateFeedbackInput, UpdateFeedbackInput } from "./feedback.schema";
import { logger } from "../../config/logger";

export interface FaqFeedbackRecord {
  id: string;
  rating: number | null;
  feedback: string;
  name: string | null;
  email: string | null;
  category: string;
  status: "new" | "reviewed" | "resolved" | "archived";
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class FeedbackService {
  public static async create(
    data: CreateFeedbackInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<FaqFeedbackRecord> {
    const id = `FB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const now = new Date();

    const query = `
      INSERT INTO public.faq_feedback (
        id, rating, feedback, name, email, category, status, ip_address, user_agent, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      id,
      data.rating || null,
      data.feedback,
      data.name || null,
      data.email || null,
      data.category || "general",
      "new",
      ipAddress || null,
      userAgent || null,
      now,
      now,
    ];

    const result = await pgPool.query(query, values);
    const row = result.rows[0];

    logger.info(`New FAQ feedback recorded: ${id} (Rating: ${data.rating ?? "N/A"})`);

    return {
      id: row.id,
      rating: row.rating,
      feedback: row.feedback,
      name: row.name,
      email: row.email,
      category: row.category,
      status: row.status,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  public static async getAll(filter?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<FaqFeedbackRecord[]> {
    let baseQuery = "SELECT * FROM public.faq_feedback WHERE 1=1";
    const values: any[] = [];
    let idx = 1;

    if (filter?.status && filter.status !== "all") {
      baseQuery += ` AND status = $${idx++}`;
      values.push(filter.status);
    }

    if (filter?.category && filter.category !== "all") {
      baseQuery += ` AND category = $${idx++}`;
      values.push(filter.category);
    }

    if (filter?.search && filter.search.trim()) {
      baseQuery += ` AND (feedback ILIKE $${idx} OR name ILIKE $${idx} OR email ILIKE $${idx})`;
      values.push(`%${filter.search.trim()}%`);
      idx++;
    }

    baseQuery += " ORDER BY created_at DESC";

    const result = await pgPool.query(baseQuery, values);
    return result.rows.map((row: any) => ({
      id: row.id,
      rating: row.rating,
      feedback: row.feedback,
      name: row.name,
      email: row.email,
      category: row.category,
      status: row.status,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  public static async getStats(): Promise<{
    total: number;
    newCount: number;
    reviewedCount: number;
    resolvedCount: number;
    avgRating: number;
  }> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'reviewed') as reviewed_count,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count,
        ROUND(AVG(rating) FILTER (WHERE rating IS NOT NULL), 2) as avg_rating
      FROM public.faq_feedback
    `;

    const result = await pgPool.query(statsQuery);
    const row = result.rows[0];

    return {
      total: parseInt(row.total || "0", 10),
      newCount: parseInt(row.new_count || "0", 10),
      reviewedCount: parseInt(row.reviewed_count || "0", 10),
      resolvedCount: parseInt(row.resolved_count || "0", 10),
      avgRating: parseFloat(row.avg_rating || "0"),
    };
  }

  public static async update(
    id: string,
    data: UpdateFeedbackInput
  ): Promise<FaqFeedbackRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(data.status);
    }

    updates.push(`updated_at = $${idx++}`);
    values.push(new Date());

    values.push(id);
    const query = `
      UPDATE public.faq_feedback
      SET ${updates.join(", ")}
      WHERE id = $${idx}
      RETURNING *
    `;

    const result = await pgPool.query(query, values);
    if (result.rowCount === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      rating: row.rating,
      feedback: row.feedback,
      name: row.name,
      email: row.email,
      category: row.category,
      status: row.status,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  public static async delete(id: string): Promise<boolean> {
    const result = await pgPool.query("DELETE FROM public.faq_feedback WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
