import {NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const runtime = "node";

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    return NextResponse.json({message: "This is a secret admin route!"});
}
