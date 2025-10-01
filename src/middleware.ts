import {withAuth} from "next-auth/middleware";
import {checkAccess} from "@/lib/roleCheck";
import type {NextRequest} from "next/server";

export default withAuth(
    function middleware(_req: NextRequest) {
        // no unused parameter → no ESLint warning
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                return checkAccess(token, req.nextUrl.pathname);
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"], // you can add more later
};
