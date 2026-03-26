# Architecture

**Analysis Date:** 2025-02-27

## Pattern Overview

**Overall:** Modular Monolith with Vertical Slices (in `src/modules/`) and Shared Infrastructure Layers.

**Key Characteristics:**
- **Vertical Slices:** Core domain logic (actions, components, services, types, validators) is grouped by module in `src/modules/` (e.g., `property`, `blog`, `user`).
- **Server Actions for Mutations:** Next.js Server Actions are the primary mechanism for handling form submissions and data modifications.
- **Service Layer for Business Logic:** Complex logic, especially that involving database transactions or cross-module concerns, is encapsulated in domain-specific services.
- **Shared UI Layer:** Base UI components and common layout elements are located in `src/components/`, while module-specific UI lives within its respective module.

## Layers

**Route/UI Layer (Frontend):**
- Purpose: Handles routing, page layouts, and the user interface.
- Location: `src/app/` and `src/modules/*/components/`
- Contains: Next.js pages, layouts, and React components.
- Depends on: Server Actions, Hooks, Stores, Types.
- Used by: Browser/End-user.

**Action Layer (Server Actions):**
- Purpose: Orchestrates requests from the UI, handles authentication checks, validation, and calls services.
- Location: `src/actions/` (shared) and `src/modules/*/actions/` (module-specific)
- Contains: `"use server"` functions.
- Depends on: Services, Prisma, Validators, Next-Auth.
- Used by: React components (Client and Server).

**Service Layer (Business Logic):**
- Purpose: Implements core business rules, handles complex data orchestration, and database transactions.
- Location: `src/modules/*/services/`
- Contains: Service classes or functions (e.g., `PropertyService`, `EntitlementService`).
- Depends on: Prisma, Utilities.
- Used by: Server Actions, Scripts.

**Data Access Layer (Persistence):**
- Purpose: Manages interaction with the PostgreSQL database.
- Location: `src/lib/prisma.ts` and `prisma/schema.prisma`
- Contains: Prisma client instance and database schema.
- Depends on: PostgreSQL.
- Used by: Services, Server Actions.

**State Management Layer:**
- Purpose: Manages client-side application state (e.g., wizards, filters, user session).
- Location: `src/stores/` and `src/modules/*/stores/`
- Contains: Zustand stores.
- Depends on: Types.
- Used by: Client Components.

## Data Flow

**Standard Mutation Flow:**

1. **Component**: User interacts with a React component (e.g., `PropertyForm`).
2. **Action**: The component invokes a Server Action (e.g., `createPropertyAction`).
3. **Validation**: The Server Action validates the input using a Zod schema (`src/modules/property/validators/`).
4. **Service**: The Server Action calls a service function (`src/modules/property/services/createProperty.ts`).
5. **Database**: The service performs operations using the Prisma client (`src/lib/prisma.ts`).
6. **Revalidation**: The Server Action triggers `revalidatePath` to refresh Next.js cache.
7. **Response**: The Server Action returns a success/error response to the component.

**State Management Flow:**

- Client components use Zustand stores (`src/stores/`) to manage multi-step forms (e.g., `AdvertiseWizard`) or global state (e.g., `useLocationStore`).

## Key Abstractions

**Entitlement Service:**
- Purpose: Manages and enforces user quotas and permissions (e.g., "PROPERTY_SLOT" usage).
- Examples: `src/modules/entitlement/entitlement.service.ts`
- Pattern: Singleton/Service.

**Governance Service:**
- Purpose: Handles moderation and tri-state governance (Approve/Reject/Review).
- Examples: `src/modules/governance/governance.service.ts`
- Pattern: Service.

**Media Module:**
- Purpose: Centralized handling of media uploads and usage across the application.
- Examples: `src/modules/media/`
- Pattern: Modular Utility Service.

## Entry Points

**Main Web Application:**
- Location: `src/app/page.tsx`
- Triggers: Browser request.
- Responsibilities: Renders the home page and root layout.

**API Endpoints:**
- Location: `src/app/api/`
- Triggers: HTTP requests (external or internal).
- Responsibilities: Provides JSON responses for specific features (e.g., Webhooks, Post/Property retrieval).

**Database Seeding:**
- Location: `prisma/seed.ts`, `prisma/seed-prod.ts`
- Triggers: `npm run seed`.
- Responsibilities: Populates the database with initial/reference data.

## Error Handling

**Strategy:** Layered error handling with typed response objects.

**Patterns:**
- **Server Action Error Handling**: Uses utility functions like `handleServerError` or returns objects with `success: false` and `error` details.
- **Client-side Error Handling**: Components use `sonner` for toast notifications or local state to display validation errors from Zod.
- **Service Error Handling**: Throws errors that are caught by the Action layer.

## Cross-Cutting Concerns

**Logging:** Standard `console.log` and `console.error` are used.
**Validation:** Zod is used for all schema definitions and runtime validation in `src/validators/` and `src/modules/*/validators/`.
**Authentication:** NextAuth.js is used for session management and authentication, configured in `src/modules/user/routes/auth.ts`.
**File Storage:** Cloudinary integration for image hosting, managed via `src/lib/cloudinary.ts`.

---

*Architecture analysis: 2025-02-27*
