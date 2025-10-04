import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
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
        console.error("Error fetching users:", error);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
