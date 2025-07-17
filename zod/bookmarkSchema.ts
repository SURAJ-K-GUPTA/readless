import { z } from "zod";

export const bookmarkSchema = z.object({
  url: z.url(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  favicon: z.url().optional(),
  tags: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
});

export type BookmarkSchemaInput = z.infer<typeof bookmarkSchema>;
