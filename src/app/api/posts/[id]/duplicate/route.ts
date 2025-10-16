// src/app/api/posts/[id]/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST duplicate a post
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Note the Promise here
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["ADMIN", "EDITOR", "WRITER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params; // We await the params here

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

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
