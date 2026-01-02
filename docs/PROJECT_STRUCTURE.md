# Project Structure Documentation

## Directory Overview

The project follows a modular, feature-based architecture built on Next.js 16 App Router.

### Root Directory
| File/Folder | Description |
| :--- | :--- |
| `src/` | Main source code |
| `prisma/` | Database schema, migrations, and seed scripts |
| `public/` | Static assets (images, icons) |
| `docs/` | Project documentation |
| `gemini/` | AI context and instruction files |
| `next.config.ts` | Next.js configuration |
| `package.json` | Dependencies and scripts |

### Source (`src/`)
| Directory | Purpose |
| :--- | :--- |
| `actions/` | Global Server Actions |
| `app/` | Next.js App Router (pages, layouts, API routes) |
| `components/` | React components (UI, common, feature-specific) |
| `lib/` | Core utilities, API clients, and configuration |
| `modules/` | Domain-driven feature modules (Business Logic) |
| `stores/` | Global state management (Zustand) |
| `types/` | Global TypeScript type definitions |
| `utils/` | Shared helper functions |
| `validators/` | Zod schemas for data validation |

## Module Architecture (`src/modules/`)

The application is divided into domain-specific modules. Each module typically contains:

*   **`actions/`**: Server Actions specific to the module.
*   **`components/`**: Module-specific UI components.
*   **`services/`**: Business logic and database interactions (Prisma).
*   **`stores/`**: Module-specific state (if needed).
*   **`types/`**: Module-specific TypeScript interfaces.
*   **`validators/`**: Zod schemas for module forms and API validation.

### Active Modules
*   **`admin`**: Administration logic.
*   **`blog`**: Blog post management, categories, publishing.
*   **`lead`**: Lead generation and management.
*   **`media`**: Media upload and management.
*   **`pricing`**: Pricing plans and logic.
*   **`project`**: Off-plan projects, developers, floorplans.
*   **`property`**: Property listings, types, and features.
*   **`user`**: User management and authentication profiles.

## Application Routes (`src/app/`)

### Frontend (`src/app/(frontend)/`)
*   **(auth)**: Authentication routes (login, register).
*   **(public)**: Public marketing pages.
*   **admin/**: Protected administration dashboard.
    *   `approvals/`, `blog/`, `projects/`, `properties/`, etc.
*   **Feature Routes**: `blogs/`, `projects/`, `properties/`, `off-plan/`, `for-sale/`, `for-rent/`.

### API (`src/app/api/`)
*   REST endpoints for external integrations or client-side fetching where Server Actions aren't suitable.

## Database (Prisma)
Located in `prisma/schema.prisma`.
*   **Core Models**: `User`, `Property`, `Project`, `Post` (Blog).
*   **Enums**: `Role`, `PropertyStatus`, `ProjectType`, etc.
*   **Relations**: Extensive use of relations for connecting users, properties, projects, and media.

## Key Configuration Files
*   `next.config.ts`: Image domains, experimental flags.
*   `tailwind.config.ts` (inferred): Styling configuration.
*   `tsconfig.json`: TypeScript compiler options.
*   `.env`: Environment variables (Database URL, NextAuth Secret).
