// src/app/api/posts/public/[slug]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  slug: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { slug } = params; // ✅ params.slug is required

    const post = await prisma.post.findFirst({
      where: { slug, published: true }, // Only published posts
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            // image: true
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.error("GET /api/posts/public/[slug] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
