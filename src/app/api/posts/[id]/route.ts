// src/app/api/v1/posts/[id]/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {postUpdateSchema} from "@/validators/postUpdate";
import {generateSlug} from "@/utils/slug";

interface Params {
    id: string;
}

// GET single post (public, or keep for Admin list)
export async function GET(req: Request, {params}: { params: Params }) {
    const {id} = params;

    const post = await prisma.post.findUnique({
        where: {id: Number(id)},
        include: {
            author: {select: {id: true, name: true, role: true}},
        },
    });

    if (!post) return NextResponse.json({error: "Post not found"}, {status: 404});
    return NextResponse.json(post);
}

// PUT update post (ADMIN-only)
export async function PUT(req: Request, {params}: { params: Params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (session.user.role !== "ADMIN")
        return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {id} = params;
    const json = await req.json();
    const parsed = postUpdateSchema.safeParse(json);

    if (!parsed.success)
        return NextResponse.json({error: parsed.error.flatten()}, {status: 400});

    const data = parsed.data;
    if (data.slug === undefined && data.title) data.slug = generateSlug(data.title);

    try {
        const updatedPost = await prisma.post.update({
            where: {id: Number(id)},
            data,
        });
        return NextResponse.json(updatedPost);
    } catch (err) {
        console.error("PUT /posts/[id] error:", err);
        return NextResponse.json({error: "Failed to update post"}, {status: 500});
    }
}

// DELETE post (ADMIN-only)
export async function DELETE(_req: Request, {params}: { params: Params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (session.user.role !== "ADMIN")
        return NextResponse.json({error: "Forbidden"}, {status: 403});

    const {id} = params;
    try {
        await prisma.post.delete({where: {id: Number(id)}});
        return NextResponse.json({message: "Post deleted"});
    } catch (err) {
        console.error("DELETE /posts/[id] error:", err);
        return NextResponse.json({error: "Failed to delete post"}, {status: 500});
    }
}
