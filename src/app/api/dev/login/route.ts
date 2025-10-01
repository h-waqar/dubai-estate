import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {encode} from "next-auth/jwt";
import type {JWT} from "next-auth/jwt";

export const runtime = "node";

export async function POST(req: Request) {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json({error: "Dev login only"}, {status: 403});
    }

    try {
        const {email, password} = await req.json();
        if (!email || !password) {
            return NextResponse.json({error: "Missing fields"}, {status: 400});
        }

        // Find user in database
        const user = await prisma.user.findUnique({where: {email}});
        if (!user || !user.password) return NextResponse.json({error: "Invalid credentials"}, {status: 401});

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return NextResponse.json({error: "Invalid credentials"}, {status: 401});

        const token = {sub: user.id.toString(), role: user.role} as JWT;
        const secret = process.env.NEXTAUTH_SECRET || "dev-secret";
        const encodedToken = await encode({token, secret, maxAge: 60 * 60 * 24});


        return NextResponse.json({jwt: encodedToken});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
