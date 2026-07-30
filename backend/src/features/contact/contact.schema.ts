// src/features/contact/contact.schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10).max(2000),
  // Honeypot field — real users never fill this in; bots that auto-fill
  // every field will, so we silently drop the submission if it's set.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
