import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(["register", "login"]),
});

export type UserSchemaInput = z.infer<typeof userSchema>;
