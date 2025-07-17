import { z } from "zod";

export const bookmarkSchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  summary: z.string().optional(),
  favicon: z.string().optional(),
  tags: z.array(z.string()).optional(),
  orderIndex: z.number().optional(),
});

export type BookmarkSchemaInput = z.infer<typeof bookmarkSchema>;
