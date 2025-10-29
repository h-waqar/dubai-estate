// ============================================
// src/modules/blog/validators/category.validator.ts
// ============================================

import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  icon: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryUpdateSchema = categorySchema.partial();
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
