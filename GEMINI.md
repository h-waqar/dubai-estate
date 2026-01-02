# Dubai Estate - Project Context

## Project Overview

**Dubai Estate** is a comprehensive full-stack real estate application built to manage and showcase properties and off-plan projects in Dubai. It features a robust backend for content management (properties, projects, blogs) and a modern, responsive frontend for end-users.

The system includes role-based access control (RBAC), media management, a sophisticated blog system, and detailed property/project listings with support for rich media (images, videos, floorplans).

## Tech Stack

### Core Frameworks
- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend & Database
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (v4)
- **Server State:** React Server Components (RSC) & Server Actions

### Tools & Utilities
- **Forms:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) (Validation)
- **Rich Text:** [Tiptap](https://tiptap.dev/)
- **Maps:** [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/)
- **Linting:** ESLint

## Architecture & Structure

The project follows the **Next.js App Router** structure with a feature-based organization in `src`.

```
src/
├── actions/            # Server Actions for data mutation
├── app/                # Next.js App Router pages and layouts
│   ├── (frontend)/     # Public facing routes
│   ├── admin/          # Admin dashboard routes
│   └── api/            # API Routes
├── components/         # React components
│   ├── ui/             # Reusable UI primitives (shadcn)
│   ├── common/         # Shared components
│   └── [feature]/      # Feature-specific components (blog, property, etc.)
├── lib/                # Utilities, API clients, and configuration
├── modules/            # Domain logic and service layers
├── prisma/             # Database schema and migrations
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Database Schema (Prisma)

Key models define the application's domain:

*   **User & Auth:** `User`, `Account`, `Session`, `VerificationToken`, `Role` (Enum).
*   **Properties:** `Property`, `PropertyType`, `PropertyImage`, `PropertyFeature`.
*   **Projects:** `Project`, `Developer`, `ProjectFloorplan`, `ProjectAmenity`, `ProjectProgress`.
*   **Blog:** `Post`, `Category`, `Tag`.
*   **Media:** `Media`, `MediaUsage` (Polymorphic association for images/videos).

## Development Workflow

### Prerequisites
*   Node.js (v20+)
*   PostgreSQL Database

### Environment Variables
Ensure `.env` is configured with:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Apply database migrations |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npm run seed` | Seed database with initial data |

## Key Features & Status

### 1. Blog System
*   **Status:** Implementation Complete
*   **Features:** Markdown/Tiptap editor, Categories, Publishing workflow, Duplicate functionality, Public view with SEO.
*   **Path:** `src/modules/blog`, `src/app/(frontend)/blog`

### 2. Properties Module
*   **Features:** detailed listings, image galleries, features/amenities, approval workflow.
*   **Status:** Active development.

### 3. Projects Module
*   **Features:** Off-plan projects, developers, construction updates, payment plans, floorplans.
*   **Status:** Active development.

## Coding Conventions

*   **Components:** Functional components with strict TypeScript typing.
*   **Styling:** Utility-first with Tailwind CSS. Use `cn()` utility for class merging.
*   **State Management:** Prefer Server State (RSC) where possible. Use `zustand` for complex client state if needed.
*   **Data Fetching:** Server Components fetch data directly via Prisma or cached services. Client components use API routes or Server Actions.
*   **Imports:** Use absolute imports (e.g., `@/components/...`).

<!-- Imported from: docs/MODE_Index.md -->
# /sg:index - Project Documentation

## Triggers
- Project documentation creation and maintenance requirements
- Knowledge base generation and organization needs
- API documentation and structure analysis requirements
- Cross-referencing and navigation enhancement requests

## Usage
```
/sg:index [target] [--type docs|api|structure|readme] [--format md|json|yaml]
```

## Behavioral Flow
1. **Analyze**: Examine project structure and identify key documentation components
2. **Organize**: Apply intelligent organization patterns and cross-referencing strategies
3. **Generate**: Create comprehensive documentation with framework-specific patterns
4. **Validate**: Ensure documentation completeness and quality standards
5. **Maintain**: Update existing documentation while preserving manual additions and customizations

## MCP Integration
- **Sequential MCP**: Complex multi-step project analysis and systematic documentation generation
- **Context7 MCP**: Framework-specific documentation patterns and documentation standards
- **Persona Coordination**: Architect (structure), Scribe (content), Quality (validation)

## Tool Coordination
- **Read/Grep/Glob**: Project structure analysis and content extraction
- **Write**: Documentation creation with intelligent organization
- **TodoWrite**: Progress tracking for complex workflows
- **Task**: Advanced delegation

## Key Patterns
- **Structure Analysis**: Project examination → component identification → logical organization
- **Documentation Types**: API docs → Structure docs → README → Knowledge base
- **Quality Validation**: Completeness → accuracy → standards → maintenance