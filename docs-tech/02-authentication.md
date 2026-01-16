# Authentication & Authorization

## Overview

Authentication is handled by **NextAuth.js v4**.
Authorization is handled via **Role-Based Access Control (RBAC)** stored in the database.

## Auth Flow

1.  **Login**: Users login via `src/app/(frontend)/(auth)/login`.
2.  **Provider**: Credentials Provider (Email/Password) and potentially others configured in `src/app/api/auth/[...nextauth]/route.ts`.
3.  **Session**: JWT-based sessions.
4.  **Middleware**: No global middleware file found (`middleware.ts` missing in root/src). Authorization is likely handled per-page or in layout components (e.g., `src/app/(frontend)/admin/layout.tsx`).

## Roles

Defined in Prisma Enum `Role`:
- `SUPER_ADMIN`: Full system access.
- `ADMIN`: General administrative access.
- `EDITOR`, `WRITER`, `MANAGER`, `SUPPORT`: Intermediate roles.
- `USER`: Standard user/agent.

## Protection Mechanisms

### 1. Layout Protection
Example: `src/app/(frontend)/admin/layout.tsx`
- Checks `useSession()`.
- If no session, redirects to `/login`.
- **Note**: This is client-side protection. Secure data fetching must also verify session on server.

### 2. Server Action Protection
Example: `createPropertyAction`
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return { success: false, error: "Unauthorized" };
}
```

## User Registration
- Route: `/register`
- Logic: `src/actions/auth.ts` -> `registerUser`
- Security:
  - Captcha verification (Turnstile).
  - Password hashing (bcrypt).
  - Unique email check.
  - Sends Welcome Email via `nodemailer`.
