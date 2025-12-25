
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

export async function registerUser(req: NextRequest) {
    try {
        const { email, password, name, captchaToken } = await req.json();

        // 0. Verify Captcha
        if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
            if (!captchaToken) {
                return NextResponse.json({ error: "Please complete the CAPTCHA" }, { status: 400 });
            }
            const isCaptchaValid = await verifyTurnstile(captchaToken);
            if (!isCaptchaValid) {
                return NextResponse.json({ error: "CAPTCHA validation failed" }, { status: 400 });
            }
        }

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
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
            { id: user.id, email: user.email, role: user.role },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
