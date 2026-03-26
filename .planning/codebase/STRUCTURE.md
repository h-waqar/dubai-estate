# Codebase Structure

**Analysis Date:** 2025-02-27

## Directory Layout

```
dubai_estate/app/
├── prisma/             # Database schema, migrations, and seeds
├── public/             # Static assets (images, fonts, etc.)
└── src/                # Main source code
    ├── actions/        # Global Server Actions
    ├── app/            # Next.js App Router (pages, layouts, API)
    ├── components/     # Shared UI components
    ├── hooks/          # Shared React hooks
    ├── lib/            # Shared utilities and infrastructure
    ├── modules/        # Domain-driven vertical slices
    ├── scripts/        # Utility and maintenance scripts
    ├── stores/         # Shared state management
    ├── types/          # Global TypeScript definitions
    ├── utils/          # Shared helper functions
    └── validators/     # Shared Zod validation schemas
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js routing and entry points.
- Contains: `layout.tsx`, `page.tsx`, and route groups like `(frontend)`.
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`.

**`src/modules/`:**
- Purpose: Core domain logic organized as independent "vertical slices".
- Contains: Subdirectories for each domain (e.g., `property`, `blog`, `user`, `media`).
- Key files: `src/modules/property/services/createProperty.ts`, `src/modules/media/actions/uploadMedia.ts`.

**`src/components/`:**
- Purpose: Shared and low-level UI components.
- Contains: Shadcn/ui components in `ui/`, layouts in `layout/`, and common domain components.
- Key files: `src/components/ui/button.tsx`, `src/components/layout/Navbar.tsx`.

**`src/lib/`:**
- Purpose: Central configuration for external services and core infrastructure.
- Contains: Database client, Cloudinary client, Email configuration.
- Key files: `src/lib/prisma.ts`, `src/lib/cloudinary.ts`.

**`prisma/`:**
- Purpose: Database definition and orchestration.
- Contains: `schema.prisma` and database migrations.
- Key files: `prisma/schema.prisma`, `prisma/seed.ts`.

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Home page.
- `src/app/layout.tsx`: Root layout.
- `src/app/api/auth/[...nextauth]/route.ts`: Authentication entry point.

**Configuration:**
- `next.config.ts`: Next.js configuration.
- `prisma.config.ts`: Prisma database config.
- `tailwind.config.ts`: Tailwind CSS configuration.

**Core Logic:**
- `src/modules/*/services/`: Business logic.
- `src/modules/*/actions/`: Server mutation logic.

**Testing:**
- Not detected in the standard `test/` directory.

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- Actions: `camelCase.ts` or `name.actions.ts` (e.g., `createProperty.ts`)
- Services: `camelCase.ts` or `name.service.ts` (e.g., `ledger.service.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)

**Directories:**
- `kebab-case` or `lower-case` (e.g., `for-sale`, `property`)

## Where to Add New Code

**New Feature (Domain-Specific):**
- Implementation: Create a new module in `src/modules/[module-name]/`.
- Routing: Add relevant pages in `src/app/(frontend)/[module-route]/`.

**New Component/Module:**
- Shared: `src/components/common/` or `src/components/ui/`.
- Domain-specific: `src/modules/[module-name]/components/`.

**Utilities:**
- Global helpers: `src/utils/`.
- Infrastructure wrappers: `src/lib/`.

## Special Directories

**`src/modules/[module]/actions`:**
- Purpose: Contains Next.js Server Actions specific to the module.
- Generated: No
- Committed: Yes

**`src/modules/[module]/validators`:**
- Purpose: Contains Zod validation schemas for forms and API requests within that module.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2025-02-27*
