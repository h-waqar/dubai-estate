// ============================================
// src/app/api/categories/route.ts
// ============================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/validators/category";

// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: validated,
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// ============================================
// Example: Fetching posts with categories
// src/app/api/posts/route.ts
// ============================================
// export async function GET() {
//   try {
//     const posts = await prisma.post.findMany({
//       include: {
//         category: true, // Include full category object
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ data: posts });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch posts" },
//       { status: 500 }
//     );
//   }
// }
