// ============================================
// src/types/category.ts
// ============================================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number; // Prisma relation count
  };
}
