// src/app/api/posts/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/modules/blog/services/post.service";
import { handleApiError } from "@/lib/errorHandler";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const posts = await getPublishedPosts(category, limit);

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
