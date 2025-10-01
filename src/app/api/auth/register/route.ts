// src/app/api/auth/register/route.ts

import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const {email, password, name} = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({error: "Missing fields"}, {status: 400});
        }

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "USER", // default role
                profile: {
                    create: {}, // optional profile auto-create
                },
            },
        });

        return NextResponse.json(
            {id: user.id, email: user.email, role: user.role},
            {status: 201}
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
