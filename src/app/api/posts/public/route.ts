// src/app/api/posts/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    // const limit = limitParam ? parseInt(limitParam, 10) : undefined;

      const parsedLimit = limitParam ? parseInt(limitParam, 10) : undefined;
      const finalLimit = (parsedLimit && !isNaN(parsedLimit) && parsedLimit > 0)
          ? parsedLimit
          : undefined;

    // const where: any = { published: true };
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
      take: finalLimit,
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
        author: true, // ✅ include full object; could be null
      },
    });

    // Map author to only fields you want and handle null
    const cleanPosts = posts.map((p) => ({
      ...p,
      author: p.author
        ? {
            id: p.author.id,
            name: p.author.name,
            email: p.author.email,
            image: p.author.image,
          }
        : null,
    }));

    return NextResponse.json(cleanPosts, { status: 200 });
  } catch (err) {
    console.error("GET /api/posts/public error:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
