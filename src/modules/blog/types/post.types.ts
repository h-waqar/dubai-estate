// // ============================================
// // src\modules\blog\types\post.types.ts
// // ============================================
// import type { PostInput as ZodPostInput } from "../validators/post.validator";
// import type { PostUpdateInput as ZodPostUpdateInput } from "../validators/postUpdate.validator";
// import { z } from "zod";
// import type { Category } from "./category.types";

// export type CreatePostInput = ZodPostInput;
// export type UpdatePostInput = ZodPostUpdateInput;

// /**
//  * Form schema with proper categoryId
//  */
// // export const postFormSchema = z.object({
// //   title: z.string().min(3, "Title must be at least 3 characters").default(""),
// //   slug: z.string().min(3, "Slug must be at least 3 characters").default(""),
// //   content: z
// //     .string()
// //     .min(10, "Content must be at least 10 characters")
// //     .default(""),
// //   excerpt: z.string().default(""),
// //   tags: z.array(z.string()).default([]),
// //   categoryId: z.number().nullable().default(null), // Proper type for form
// //   coverImage: z.string().default(""),
// //   published: z.boolean().default(false),
// //   lastSavedAt: z.string().optional(),
// //   draftId: z.union([z.string(), z.number()]).optional(),
// // });
// export const postFormSchema = z.object({
//   // ✅ Required fields (must have values, can start as empty string)
//   title: z.string().min(1, "Title is required"),
//   slug: z.string().min(1, "Slug is required"),
//   content: z.string().min(1, "Content is required"),
//   published: z.boolean().default(false),

//   // ✅ Optional fields (can be undefined/null)
//   excerpt: z.string().optional(),
//   tags: z.array(z.string()).optional().default([]),
//   categoryId: z.number().nullable().optional(),
//   coverImage: z.string().optional(),
//   lastSavedAt: z.string().optional(),
//   draftId: z.union([z.string(), z.number()]).optional(),
// });

// export type PostFormData = z.infer<typeof postFormSchema>;
// export type PartialPostFormData = Partial<PostFormData>;

// export const defaultPostFormData: PostFormData = {
//   title: "",
//   slug: "",
//   content: "",
//   excerpt: "",
//   tags: [],
//   categoryId: null,
//   coverImage: "",
//   published: false,
// };

// /**
//  * Post interface matching Prisma exactly
//  */
// export interface Post {
//   id: number;
//   title: string;
//   slug: string;
//   content: string;
//   excerpt: string | null;
//   coverImage: string | null;
//   categoryId: number | null;
//   tags: string[];
//   published: boolean;
//   authorId: number;
//   publishedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// /**
//  * Post with populated relations (for display)
//  */
// export interface PostWithRelations extends Post {
//   category: Category | null;
//   author: {
//     id: number;
//     name: string | null;
//     email: string;
//     image: string | null;
//   };
// }

// /**
//  * Helper to convert form data to API input
//  */
// export function formDataToCreateInput(
//   data: PostFormData,
//   authorId: number
// ): CreatePostInput {
//   return {
//     title: data.title,
//     slug: data.slug,
//     content: data.content,
//     excerpt: data.excerpt || undefined,
//     categoryId: data.categoryId || undefined,
//     tags: data.tags,
//     coverImage: data.coverImage || undefined,
//     published: data.published,
//     authorId,
//   };
// }

// export function formDataToUpdateInput(
//   data: Partial<PostFormData>
// ): UpdatePostInput {
//   const update: UpdatePostInput = {};

//   if (data.title !== undefined) update.title = data.title;
//   if (data.slug !== undefined) update.slug = data.slug;
//   if (data.content !== undefined) update.content = data.content;
//   if (data.excerpt !== undefined) update.excerpt = data.excerpt;
//   if (data.categoryId !== undefined) update.categoryId = data.categoryId;
//   if (data.tags !== undefined) update.tags = data.tags;
//   if (data.coverImage !== undefined) update.coverImage = data.coverImage;
//   if (data.published !== undefined) update.published = data.published;

//   return update;
// }

// /**
//  * API response types
//  */
// export interface ApiListResponse<T> {
//   data: T[];
//   meta?: {
//     total?: number;
//     page?: number;
//     perPage?: number;
//   };
// }

// export interface ApiItemResponse<T> {
//   data: T;
// }

// ============================================
// src\modules\blog\types\post.types.ts
// ============================================
import type { PostInput as ZodPostInput } from "../validators/post.validator";
import type { PostUpdateInput as ZodPostUpdateInput } from "../validators/postUpdate.validator";
import { z } from "zod";
import type { Category } from "./category.types";

export type CreatePostInput = ZodPostInput;
export type UpdatePostInput = ZodPostUpdateInput;

/**
 * Form schema - EXPLICIT about what's required
 */
export const postFormSchema = z.object({
  // Required fields - NO .default() to avoid confusion
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean(), // ✅ Required, no default
  tags: z.array(z.string()), // ✅ Required, no default

  // Truly optional fields
  excerpt: z.string().optional(),
  categoryId: z.number().nullable().optional(),
  coverImage: z.string().optional(),
  lastSavedAt: z.string().optional(),
  draftId: z.union([z.string(), z.number()]).optional(),
});

export type PostFormData = z.infer<typeof postFormSchema>;
export type PartialPostFormData = Partial<PostFormData>;

export const defaultPostFormData: PostFormData = {
  title: "",
  slug: "",
  content: "",
  published: false,
  tags: [],
};

/**
 * Post interface matching Prisma exactly
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  categoryId: number | null;
  tags: string[];
  published: boolean;
  authorId: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post with populated relations (for display)
 */
export interface PostWithRelations extends Post {
  category: Category | null;
  author: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

/**
 * Helper to convert form data to API input
 */
export function formDataToCreateInput(
  data: PostFormData,
  authorId: number
): CreatePostInput {
  return {
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt || undefined,
    categoryId: data.categoryId || undefined,
    tags: data.tags,
    coverImage: data.coverImage || undefined,
    published: data.published,
    authorId,
  };
}

export function formDataToUpdateInput(
  data: Partial<PostFormData>
): UpdatePostInput {
  const update: UpdatePostInput = {};

  if (data.title !== undefined) update.title = data.title;
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.content !== undefined) update.content = data.content;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt;
  if (data.categoryId !== undefined) update.categoryId = data.categoryId;
  if (data.tags !== undefined) update.tags = data.tags;
  if (data.coverImage !== undefined) update.coverImage = data.coverImage;
  if (data.published !== undefined) update.published = data.published;

  return update;
}

/**
 * API response types
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
