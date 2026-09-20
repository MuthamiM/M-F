import { z } from "zod";

export const getDocSchema = z.object({
  params: z.object({
    category: z.string(),
    slug: z.string(),
  }),
});

export const searchDocSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search query must not be empty"),
  }),
});

export type GetDocInput = z.infer<typeof getDocSchema>["params"];
export type SearchDocInput = z.infer<typeof searchDocSchema>["query"];
