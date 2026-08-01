// src/features/auth/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().max(255),
    password: z.string().min(1).max(128),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];
