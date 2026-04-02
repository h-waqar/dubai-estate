// src/app/api/admin/secret/route.ts:1
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/modules/user/routes/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("SUPER_ADMIN"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "This is a secret admin route!" });
}
