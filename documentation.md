# Dubai Estate - Real Estate Platform Documentation

## 1. Introduction

**Dubai Estate** is a modern, full-stack real estate platform built with Next.js 16. It is designed to manage and showcase property listings, development projects, and blog content with a robust admin dashboard and a high-performance public frontend.

### Key Features
- **Property Management**: Create, edit, and list properties with detailed specs, galleries, and location data.
- **Project Showcase**: Highlight real estate development projects with floorplans, amenities, and progress tracking.
- **Blog System**: Full-featured CMS for publishing articles with rich text editing, auto-slugs, and media management.
- **Role-Based Access**: Secure Admin and Agent dashboards with granular permissions (Super Admin, Admin, Editor, Agent).
- **Responsive Design**: Mobile-first UI built with Tailwind CSS v4 and standard modern design principles.

---

## 2. Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL Database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/dubai-estate.git
    cd dubai-estate
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory (see [Environment Variables](#3-environment--config)).

4.  **Database Setup:**
    ```bash
    # Run migrations
    npx prisma migrate dev --name init

    # (Optional) Seed the database
    npm run seed
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 3. Architecture Overview

The project follows a **Feature-Based Modular Architecture** combined with the Next.js App Router.

### Directory Structure

```
.
├── prisma/                 # Database schema and seed scripts
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (admin)/        # Admin dashboard routes (protected)
│   │   ├── (frontend)/     # Public facing routes
│   │   └── api/            # Backend API Endpoints
│   ├── components/         # Shared UI components (Buttons, Inputs, etc.)
│   ├── lib/                # Core utilities (API client, Prisma client)
│   ├── modules/            # Feature-specific logic (The Core)
│   │   ├── auth/           # Authentication logic
│   │   ├── blog/           # Blog components, types, stores
│   │   ├── property/       # Property management logic
│   │   ├── project/        # Project management logic
│   │   └── user/           # User management hooks and types
│   └── styles/             # Global styles
└── next.config.ts          # Next.js configuration
```

### Key Design Patterns
- **Modules**: Code related to a specific domain (e.g., `blog`) is co-located in `src/modules/blog`. This includes types, components, hooks, and services.
- **Server vs Client Components**:
    - **Page.tsx** files are typically Server Components for data fetching.
    - **Components** requiring interactivity (forms, carousels) are marked `"use client"`.
- **Zustand Stores**: Global state (like `usePostStore`) is managed via Zustand for complex forms and UI state.

---

## 4. Environment & Config

Create a `.env` file in the root with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/dubai_estate?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
# Generate secret with: openssl rand -base64 32

# (Optional) External Services
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
```

---

## 5. Routing & Navigation

The application uses the **Next.js App Router**.

- **Public Routes**:
    - `/` (Homepage)
    - `/properties` (Listing grid)
    - `/properties/[slug]` (Property details)
    - `/projects` (Project listing)
    - `/blogs` (Blog listing)

- **Admin Routes** (`src/app/(admin)/admin`):
    - `/admin/dashboard` (Analytics)
    - `/admin/properties` (CRUD)
    - `/admin/blog` (CMS)
    - `/admin/users` (User management)

**Navigation Loading**:
The app uses `loading.tsx` and `error.tsx` boundaries to handle loading states and unexpected errors gracefully.

---

## 6. Data Fetching & State Management

### Data Fetching
1.  **Server-Side**:
    - Direct database access using `prisma` in Server Components (`page.tsx`, `layout.tsx`).
    - Example: `const posts = await prisma.post.findMany(...)`.
2.  **Client-Side**:
    - For dynamic interactions (e.g., search, infinite scroll), we use `axios` via a pre-configured `api` instance (`src/lib/api.ts`).
    - Standard `useEffect` or event handlers trigger these requests.

### State Management
- **Server State**: Managed primarily via URL parameters (search, pagination) or direct server rendering.
- **Client State**:
    - **Zustand**: Used for complex multi-step forms (e.g., Property Wizard, Post Editor).
    - **React Context**: Used for Theme toggling and Toast notifications.
    - **Local State**: `useState` for simple component interactivity.

---

## 7. Styling & UI

- **Tailwind CSS v4**: The primary styling engine. Utility-first classes.
- **Shadcn/UI**: Reusable component primitives (in `src/components/ui`) built on top of Radix UI.
- **Lucide React**: Icon library.
- **Responsive**: All views are mobile-responsive by default.

---

## 8. API & Backend

The backend is built using **Next.js API Routes** located in `src/app/api`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | POST/GET | Authentication (NextAuth) |
| `/api/posts` | GET, POST | List active posts / Create post |
| `/api/posts/[id]` | GET, PUT, DEL | Get, update, or delete a post |
| `/api/properties` | GET, POST | List properties / Create property |
| `/api/properties/[id]` | GET, PUT, DEL | Manage single property |
| `/api/projects` | GET, POST | Project management |

**Database Schema (Prisma)**:
Key models in `prisma/schema.prisma`:
- `User` (Roles: ADMIN, AGENT, USER etc.)
- `Property` (Details, Features, Images, Location)
- `Post` (Blog content, Categories, Tags)
- `Project` (Development projects, Floorplans)

---

## 9. Authentication

Authentication is handled by **NextAuth.js**.

- **Provider**: Currently configured for Credentials (email/password) using `bcryptjs` for hashing but extensible for OAuth (Google, Facebook).
- **Session**: JWT-based sessions.
- **Protection**: Middleware (`src/middleware.ts` - Check existence) or per-route checks ensure only authorized users access admin pages.
- **Hook**: `useAuth()` hook (`src/modules/user/hooks/useAuth.ts`) exposes `userId`, `role`, and `session` to client components.

---

## 10. Forms & Input Handling

- **Libraries**: `react-hook-form` + `zod` schema validation.
- **Editors**:
    - **Tiptap**: Rich text editor for Blog content.
    - **Custom Selects**: Integration with Radix UI Select.
- **Image Upload**:
    - Handled via `MediaLibrary` component.
    - Supports upload, selection, and preview.

---

## 11. Testing

*(Expand based on current setup - currently placeholder)*
- **Unit Tests**: Jest (configuration required).
- **E2E**: Cypress or Playwright (recommended for critical flows like Booking or Property Creation).
- **Manual Verification**: We use a detailed `walkthrough.md` artifact to track verifying features during development.

---

## 12. Deployment

The application is optimized for deployment on **Vercel** but runs on any generic Node.js server.

**Build Command**:
```bash
npm run build
```

**Start Command**:
```bash
npm start
```

**Output**:
Next.js Standalone output is supported for Dockerized environments (configure `output: 'standalone'` in `next.config.ts`).

---

## 13. Troubleshooting

**Common Issues**:
1.  **Prisma Client Error**:
    - *Fix*: Run `npx prisma generate` after any schema change or fresh install.
2.  **Image Load Failures**:
    - *Fix*: Ensure the domain is whitelisted in `next.config.ts` under `images.remotePatterns`.
3.  **Authentication Errors**:
    - *Fix*: Verify `NEXTAUTH_SECRET` matches in `.env`. Ensure your database user has the correct Role.

---
