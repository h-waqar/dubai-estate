// src/modules/blog/services/post.service.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { PostWithRelations } from "../types/post.types";

export async function getPublishedPosts(
  category?: string,
  limit?: number
): Promise<PostWithRelations[]> {
  const where: Prisma.PostWhereInput = { published: true };
  if (category) {
    where.category = {
      is: {
        name: category,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
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

  return posts;
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
