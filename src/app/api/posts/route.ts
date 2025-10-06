import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {postSchema} from "@/validators/post";
import {generateSlug} from "@/utils/slug";
import {decode} from "next-auth/jwt";

interface SessionUser {
    id: string;
    role: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
}

export async function POST(req: Request) {
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
                    token = {id: decoded.sub, role: decoded.role};
                } else {
                    token = null;
                }
            }
        }

        if (!token) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        if (!["ADMIN", "EDITOR", "WRITER"].includes(token.role)) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        const json = await req.json();
        const parsed = postSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json({error: parsed.error.flatten()}, {status: 400}); // ✅ replaced format()
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
                category: data.category,
                tags: data.tags ?? [],
                authorId: data.authorId ?? Number(token.id),
            },
        });

        return NextResponse.json(newPost, {status: 201});
    } catch (err) {
        console.error("POST /posts error:", err);
        return NextResponse.json({error: "Failed to create post"}, {status: 500});
    }
}
