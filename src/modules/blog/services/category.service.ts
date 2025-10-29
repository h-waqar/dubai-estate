// src/modules/blog/services/category.service.ts
import { prisma } from "@/lib/prisma";
import { categorySchema, categoryUpdateSchema } from "@/modules/blog/validators/category.validator";
import { Category } from "@/modules/blog/types/category.types";

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createCategory(data: unknown): Promise<Category> {
  const validatedData = categorySchema.parse(data);
  const category = await prisma.category.create({
    data: validatedData,
  });
  return category;
}

export async function getCategory(id: number): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
  return category;
}

export async function updateCategory(id: number, data: unknown): Promise<Category> {
  const validatedData = categoryUpdateSchema.parse(data);
  const category = await prisma.category.update({
    where: { id },
    data: validatedData,
  });
  return category;
}

export async function deleteCategory(id: number): Promise<void> {
  await prisma.category.delete({
    where: { id },
  });
}
