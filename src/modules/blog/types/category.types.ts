// src/modules/blog/types/category.types.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}