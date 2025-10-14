// src/app/api/posts/public/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const where: any = { published: true };
    if (category) where.category = category;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: !isNaN(limit) ? limit : undefined,
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
