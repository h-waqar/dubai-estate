// src/types/post.ts

// Shared TypeScript types for posts (client + server)
import type { PostInput as ZodPostInput } from "@/validators/post";
import type { PostUpdateInput as ZodPostUpdateInput } from "@/validators/postUpdate";

/**
 * Use the zod-derived types for create/update payload shapes so
 * runtime validation and TS stay in sync.
 */
export type CreatePostInput = ZodPostInput;
export type UpdatePostInput = ZodPostUpdateInput;

/**
 * Form-state shape used by the editor + zustand store.
 * Keep this aligned with the zod schema in validators/post.ts
 */
export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[]; // simple string tags (chips)
  categoryId?: string; // category id or name depending on your app
  coverImage?: string;
  published: boolean;

  // UI / staging metadata
  lastSavedAt?: string; // ISO timestamp
  draftId?: number | string; // server-side draft id if created
}

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
