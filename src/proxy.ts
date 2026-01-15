// src/proxy.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        const token = req.nextauth.token;

        if (!token) return;

        const roles = token.roles as string[] || [];
        if (req.nextUrl.pathname.startsWith("/admin") && !roles.some(role => ["SUPER_ADMIN", "ADMIN"].includes(role))) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
