# External Integrations

**Analysis Date:** 2025-03-26

## APIs & External Services

**Payments:**
- PayPal - For processing subscriptions and one-time payments.
  - SDK/Client: `@paypal/react-paypal-js`, `@paypal/checkout-server-sdk`
  - Client implementation: `src/lib/paypal-api.ts`
  - Auth: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`

**Email:**
- Brevo (via Nodemailer) - For transactional emails (password reset, notifications).
  - SDK/Client: `nodemailer`
  - Implementation: `src/lib/email.ts`
  - Auth: `BREVO_API_KEY`, `BREVO_SMTP_USER`, `BREVO_SMTP_PASSWORD`

**Captcha:**
- Cloudflare Turnstile - For bot protection.
  - SDK/Client: `@marsidev/react-turnstile`
  - Implementation: `src/lib/verifyTurnstile.ts`, `src/components/ui/TurnstileWidget.tsx`
  - Auth: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

**Maps:**
- Leaflet / OpenStreetMap - For property and project location displays.
  - SDK/Client: `leaflet`, `react-leaflet`
  - Implementation: Various frontend components (e.g., `src/modules/project/components/ProjectMap.tsx` implied by file list)

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` (Direct URL `DIRECT_URL` for Neon mentioned in `.env.example`)
  - Client: Prisma ORM

**File Storage:**
- Cloudinary - For property images, profile pictures, and project media.
  - SDK/Client: `cloudinary`, `next-cloudinary`
  - Implementation: `src/lib/cloudinary.ts`, `src/modules/media/actions/upload.action.ts`
  - Auth: `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`

**Caching:**
- None detected (Server actions and Next.js default caching strategy used)

## Authentication & Identity

**Auth Provider:**
- NextAuth.js
  - Implementation: `src/modules/user/routes/auth.ts`
  - Providers:
    - Google Provider (via `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)
    - Credentials Provider (with `bcryptjs`)
  - Persistence: Prisma Adapter (`@next-auth/prisma-adapter`)

## Monitoring & Observability

**Error Tracking:**
- Custom Error Handlers - `src/lib/errorHandler.ts`, `src/lib/handleServerError.ts`, etc.
- No external service (like Sentry) detected.

**Logs:**
- Console logging (Standard Node.js logs)

## CI/CD & Deployment

**Hosting:**
- Docker - Dockerfiles for development and production (`Dockerfile`, `Dockerfile.prod`).
- Mention of Vercel in `.env.example`.

**CI Pipeline:**
- None detected.

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Session encryption key
- `NEXT_PUBLIC_SITE_URL` - Main application URL
- `CLOUDINARY_URL` - Media storage connection
- `PAYPAL_CLIENT_SECRET` - Payment processing
- `BREVO_API_KEY` - Email service key

**Secrets location:**
- `.env` file (not committed to git).

## Webhooks & Callbacks

**Incoming:**
- PayPal Webhooks: `src/app/api/webhooks/paypal/route.ts` - For payment and subscription lifecycle updates.

**Outgoing:**
- None detected.

---

*Integration audit: 2025-03-26*
