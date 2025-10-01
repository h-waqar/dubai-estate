// import {NextResponse} from "next/server";
// import {prisma} from "@/lib/prisma";
// import {CreatePostInput} from "@/types/post";
// import {generateSlug} from "@/utils/slug";
//
// export async function GET() {
//     const posts = await prisma.post.findMany({
//         include: {author: true},
//     });
//     return NextResponse.json(posts);
// }
//
// export async function POST(req: Request) {
//     const body: CreatePostInput = await req.json();
//
//     // Auto-generate slug if not provided
//     const slug = body.slug ?? generateSlug(body.title);
//
//     const newPost = await prisma.post.create({
//         data: {
//             title: body.title,
//             content: body.content,
//             authorId: body.authorId,
//             slug,
//             excerpt: body.excerpt,
//             coverImage: body.coverImage,
//             category: body.category,
//         },
//     });
//
//     return NextResponse.json(newPost, {status: 201});
// }
