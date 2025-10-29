// src/app/api/posts/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";

// PATCH toggle publish status
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    // Get current post
    const currentPost = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: { published: true },
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Toggle published status
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        published: !currentPost.published,
        publishedAt: !currentPost.published ? new Date() : null,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (err) {
    console.error("PATCH /posts/[id]/publish error:", err);
    return NextResponse.json(
      { error: "Failed to update publish status" },
      { status: 500 }
    );
  }
}
