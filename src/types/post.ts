// src/types/post.ts

// Shared TypeScript types for posts (client + server)
import type { PostInput as ZodPostInput } from "@/validators/post";
import type { PostUpdateInput as ZodPostUpdateInput } from "@/validators/postUpdate";
import { z } from "zod";

/**
 * Use the zod-derived types for create/update payload shapes so
 * runtime validation and TS stay in sync.
 */
export type CreatePostInput = ZodPostInput;
export type UpdatePostInput = ZodPostUpdateInput;

/**
 * Form schema - single source of truth for form validation
 * CRITICAL FIX: Remove .optional() and only use .default() to make output types required
 */
export const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").default(""),
  slug: z.string().min(3, "Slug must be at least 3 characters").default(""),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .default(""),
  excerpt: z.string().default(""),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().default(""),
  coverImage: z.string().default(""),
  published: z.boolean().default(false),
  lastSavedAt: z.string().optional(),
  draftId: z.union([z.string(), z.number()]).optional(),
});

/**
 * Form-state shape inferred from Zod schema - guaranteed type safety!
 */
export type PostFormData = z.infer<typeof postFormSchema>;

/**
 * Helper type for partial form data (used in store)
 */
export type PartialPostFormData = Partial<PostFormData>;

/**
 * Default values for the form
 */
export const defaultPostFormData: PostFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  tags: [],
  categoryId: "",
  coverImage: "",
  published: false,
};

/**
 * Persisted post shape (what your API returns)
 */
export interface Post {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  published: boolean;
  authorId?: number | string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string | null;
}

/**
 * Small helper types for API responses
 */
export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export interface ApiItemResponse<T> {
  data: T;
}

/**
 * Optional: simple Tag type if you manage tags centrally
 */
export interface Tag {
  id?: number | string;
  name: string;
  slug?: string;
}
