# Technology Stack

**Analysis Date:** 2025-03-26

## Languages

**Primary:**
- TypeScript 5.x - Used for all frontend and backend logic.

**Secondary:**
- SQL (PostgreSQL) - Used for data persistence via Prisma.

## Runtime

**Environment:**
- Node.js 20+ (suggested by Next.js 16/React 19 requirements)

**Package Manager:**
- pnpm 9.x (based on `pnpm-lock.yaml`)
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- Next.js ^16.0.7 - Full-stack framework (App Router)
- React ^19.2.1 - UI Library
- Prisma ^7.5.0 - Database ORM

**Testing:**
- Not detected (No test framework or test files found in `app/`)

**Build/Dev:**
- Tailwind CSS - Utility-first CSS framework
- Turbopack - Build tool (used in `dev` and `build` scripts)
- PostCSS - CSS transformation

## Key Dependencies

**Critical:**
- `next-auth` ^4.24.12 - Authentication
- `@prisma/client` ^7.3.0 - Database client
- `react-hook-form` ^7.65.0 - Form management
- `zod` (via `@hookform/resolvers`) - Schema validation

**Infrastructure:**
- `axios` - HTTP client
- `bcryptjs` - Password hashing
- `nodemailer` - Email transport
- `cloudinary` - Image management
- `framer-motion` - Animations
- `lucide-react` - Icon set

## Configuration

**Environment:**
- Configured via `.env` and `.env.example`
- Key configs: `DATABASE_URL`, `NEXTAUTH_SECRET`, `CLOUDINARY_URL`, `PAYPAL_CLIENT_SECRET`

**Build:**
- `next.config.ts`: Next.js configuration (standalone output, image remote patterns)
- `tsconfig.json`: TypeScript configuration
- `postcss.config.mjs`: PostCSS configuration
- `prisma.config.ts`: Prisma configuration

## Platform Requirements

**Development:**
- Node.js 20+
- PostgreSQL database
- pnpm

**Production:**
- Docker (Dockerfile and docker-compose.prod.yml present)
- Deployment target: Standalone Node.js (configured in `next.config.ts`)

---

*Stack analysis: 2025-03-26*
