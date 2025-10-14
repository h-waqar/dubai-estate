// // src/app/api/posts/public/[slug]/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// interface Params {
//   slug: string;
// }

// export async function GET(req: Request, { params }: { params: Params }) {
//   try {
//     const { slug } = params; // ✅ params.slug is required

//     const post = await prisma.post.findFirst({
//       where: { slug, published: true }, // Only published posts
//       include: {
//         author: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             // image: true
//           },
//         },
//       },
//     });

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     return NextResponse.json(post, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/posts/public/[slug] error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch post" },
//       { status: 500 }
//     );
//   }
// }

// app/api/posts/public/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            // image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only return published posts for public API
    if (!post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count (optional)
    await prisma.post.update({
      where: { id: post.id },
      data: {
        // Add a views field to your schema if you want to track this
        // views: { increment: 1 }
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
