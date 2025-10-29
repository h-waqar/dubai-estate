// src/middleware.ts
import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        const token = req.nextauth.token;

        if (!token) return;

        if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({token}) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
