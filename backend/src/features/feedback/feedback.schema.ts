// src/features/feedback/feedback.schema.ts
import { z } from "zod";

export const createFeedbackSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    feedback: z.string().trim().min(3, "Feedback must be at least 3 characters").max(3000),
    name: z.string().trim().max(120).optional(),
    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .max(255)
      .optional()
      .or(z.literal("")),
    category: z.string().trim().max(80).optional().default("general"),
  }),
});

export const updateFeedbackSchema = z.object({
  body: z.object({
    status: z.enum(["new", "reviewed", "resolved", "archived"]).optional(),
  }),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>["body"];
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>["body"];
