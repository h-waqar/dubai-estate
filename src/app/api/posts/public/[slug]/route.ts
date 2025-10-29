// src/app/api/posts/public/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/modules/blog/services/post.service";
import { handleApiError } from "@/lib/errorHandler";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}