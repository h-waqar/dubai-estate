// ============================================
// src/validators/postUpdate.ts
// ============================================

import { z } from "zod";

export const postUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  categoryId: z.number().int().positive().optional().nullable(), // Can set to null
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export type PostUpdateInput = z.infer<typeof postUpdateSchema>;
