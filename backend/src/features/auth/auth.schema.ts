// src/features/auth/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(255),
  // Length only — never validate password *content* here; that's what
  // hashing + rate limiting are for. Complexity rules belong at signup, not login.
  password: z.string().min(8).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
