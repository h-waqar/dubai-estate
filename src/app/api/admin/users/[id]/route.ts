// app/api/admin/users/[id]/route.ts
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {prisma} from "@/lib/prisma";

export async function PATCH(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {role} = await request.json();
    const {id} = await params; // Await params here

    try {
        const user = await prisma.user.update({
            where: {id: parseInt(id)},
            data: {role},
        });

        return NextResponse.json(user);
        
    } catch (_error) {
        return NextResponse.json({error: "Failed to update user"}, {status: 500});
    }
}