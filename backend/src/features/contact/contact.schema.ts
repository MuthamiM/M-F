// src/features/contact/contact.schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(30).optional(),
    company: z.string().trim().max(150).optional(),
    message: z.string().trim().min(10).max(5000),
    website: z.string().max(0).optional(), // honeypot — must be empty
  }),
});

export type ContactInput = z.infer<typeof contactSchema>["body"];
