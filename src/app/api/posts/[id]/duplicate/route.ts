// src/app/api/posts/[id]/duplicate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generateSlug } from "@/utils/slug";

interface Params {
  id: string;
}

// POST duplicate a post
export async function POST(req: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["ADMIN", "EDITOR", "WRITER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  try {
    // Get original post
    const originalPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!originalPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Generate unique slug for duplicate
    const baseSlug = `${originalPost.slug}-copy`;
    let newSlug = baseSlug;
    let counter = 1;

    // Check if slug exists and increment if needed
    while (await prisma.post.findUnique({ where: { slug: newSlug } })) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create duplicate
    const duplicatedPost = await prisma.post.create({
      data: {
        title: `${originalPost.title} (Copy)`,
        slug: newSlug,
        content: originalPost.content,
        excerpt: originalPost.excerpt,
        coverImage: originalPost.coverImage,
        category: originalPost.category,
        tags: originalPost.tags,
        published: false, // Always create as draft
        authorId: Number(session.user.id), // Set current user as author
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(duplicatedPost, { status: 201 });
  } catch (err) {
    console.error("POST /posts/[id]/duplicate error:", err);
    return NextResponse.json(
      { error: "Failed to duplicate post" },
      { status: 500 }
    );
  }
}
