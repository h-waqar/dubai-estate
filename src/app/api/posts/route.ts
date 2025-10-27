// src\app\api\posts\route.ts
import { Prisma } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { postSchema } from "@/modules/blog/validators/post.validator";
import { generateSlug } from "@/utils/slug";
import { decode } from "next-auth/jwt";

interface SessionUser {
  id: number;
  role: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let token: SessionUser | null = session?.user ?? null;

    // Dev JWT fallback
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const secret = process.env.NEXTAUTH_SECRET || "dev-secret"; // ✅ Fix here
        const decoded = await decode({
          token: authHeader.split(" ")[1],
          secret,
        });
        if (decoded && decoded.sub && decoded.role) {
          token = { id: parseInt(decoded.sub), role: decoded.role as string };
        } else {
          token = null;
        }
      }
    }

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["ADMIN", "EDITOR", "WRITER"].includes(token.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = postSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      ); // ✅ replaced format()
    }

    const data = parsed.data;
    const slug = data.slug ?? generateSlug(data.title);

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        tags: data.tags ?? [],
        authorId: data.authorId ?? token.id,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("POST /posts error:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let token: SessionUser | null = session?.user ?? null;

    // 🔑 Dev JWT fallback (for API tools like Postman)
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const secret = process.env.NEXTAUTH_SECRET || "dev-secret";
        const decoded = await decode({
          token: authHeader.split(" ")[1],
          secret,
        });
        if (decoded && decoded.sub && decoded.role) {
          token = { id: parseInt(decoded.sub), role: decoded.role as string };
        } else {
          token = null;
        }
      }
    }

    // 🚫 Unauthorized or forbidden users
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["ADMIN", "EDITOR", "WRITER"].includes(token.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🧠 Optional query filters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const published = searchParams.get("published");

    const where: Prisma.PostWhereInput = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        name: category,
      };
    }
    if (published !== null) {
      where.published = published === "true";
    }

    // 📦 Fetch posts (latest first)
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.error("GET /posts error:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
