// src\app\api\dev\login\route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev login only" }, { status: 403 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );

    // const token: JWT = {sub: user.id.toString(), role: user.role};
    const token: JWT = {
      id: user.id,
      role: user.role,
      sub: user.id.toString(), // keep it for NextAuth compatibility
    };

    const secret = process.env.NEXTAUTH_SECRET || "dev-secret";
    const encodedToken = await encode({ token, secret, maxAge: 60 * 60 * 24 });

    // Set cookie so getServerSession can also work
    const cookie = serialize("next-auth.session-token", encodedToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json(
      { jwt: encodedToken },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
