import type {JWT} from "next-auth/jwt";

/**
 * Centralized role-based access control.
 * Extend this as you add new roles.
 */
export function checkAccess(token: JWT | null, pathname: string): boolean {
    if (!token) return false; // not logged in

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
        return token.role === "ADMIN";
    }

    // Example: agent-only routes
    if (pathname.startsWith("/agent")) {
        return token.role === "AGENT" || token.role === "ADMIN";
    }

    // Default: any logged-in user
    return true;
}
