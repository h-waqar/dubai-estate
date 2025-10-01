import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {prisma} from "@/lib/prisma";
import {roleCheck} from "@/lib/roleCheck";
import {authOptions} from "@/lib/auth"; // adjust if authOptions is elsewhere

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !roleCheck(session, ["ADMIN"])) {
        return NextResponse.json({error: "Unauthorized"}, {status: 403});
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {createdAt: "desc"},
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
    }
}
