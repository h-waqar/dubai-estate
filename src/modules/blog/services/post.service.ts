// src/modules/blog/services/post.service.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PostWithRelations } from "../types/post.types";

export async function getPublishedPosts({
  category,
  limit = 3,
  page = 1,
  search,
}: {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
} = {}): Promise<{ data: PostWithRelations[]; total: number }> {
  const where: Prisma.PostWhereInput = { published: true };
  
  if (category && category !== "all") {
    // If category is a number string (ID), filter by ID, else by name
    const categoryId = parseInt(category);
    if (!isNaN(categoryId)) {
       where.categoryId = categoryId;
    } else {
       where.category = {
         is: {
           name: category,
         },
       };
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        content: true,
        published: true,
        authorId: true,
        publishedAt: true,
        categoryId: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { data: posts, total };
}

export async function getPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      tags: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      content: true,
      published: true,
      authorId: true,
      publishedAt: true,
      categoryId: true,
    },
  });

  return post;
}

export async function getRelatedPosts(
  currentPostId: number,
  categoryId: number | null,
  limit = 3
) {
  if (!categoryId) return [];
  return await prisma.post.findMany({
    where: {
      id: { not: currentPostId },
      categoryId,
      published: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getFeaturedPosts(limit = 4) {
  return await prisma.post.findMany({
    where: {
      published: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      category: true,
      createdAt: true,
    },
  });
}
