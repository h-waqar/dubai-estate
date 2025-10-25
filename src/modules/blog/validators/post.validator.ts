// ============================================
// src/validators/post.ts
// ============================================
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  categoryId: z.number().int().positive().optional(), // Proper foreign key
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  authorId: z.number().int().positive(),
});

export type PostInput = z.infer<typeof postSchema>;
