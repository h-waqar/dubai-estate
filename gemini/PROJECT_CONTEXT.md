# Project Context: Dubai Estate Next.js Platform

## 1. Project Overview & Core Stack

This is a full-stack real estate platform built with Next.js 15+ (App Router). It features a modular, domain-driven architecture designed for scalability and maintainability. The primary goal is to create a platform for browsing property listings and managing content through a dedicated blog and admin dashboard.

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict)
- **ORM**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js (Credentials Provider, JWT Sessions)
- **Validation**: Zod
- **Styling**: Tailwind CSS with Shadcn UI
- **State Management**: Zustand (for client-side UI state)
- **API**: Next.js Route Handlers and Server Actions

## 2. Architecture

The codebase follows a strict modular architecture located under `src/modules/`. Each module is a self-contained feature or domain, encapsulating its own logic and components.

- **`src/modules/<domain>`**: Each feature (e.g., `blog`, `user`) lives here.

  - **`actions/`**: Server Actions for data mutation (e.g., `createCategory`).
  - **`services/`**: Core business logic and database interaction (Prisma queries). This layer is the single source of truth for data access.
  - **`validators/`**: Zod schemas for all input validation, ensuring type safety from the frontend to the database.
  - **`components/`**: React components specific to the module.
  - **`routes/`**: API route handlers (e.g., the NextAuth.js configuration is cleanly abstracted into `modules/user/routes/auth.ts`).
  - **`stores/`**: Zustand stores for managing complex client-side UI state.

- **`src/lib/`**: Contains global utilities, including the singleton `prisma` client and a configured `axios` instance `api`.
- **`src/app/`**: Handles routing, layouts, and pages, connecting the UI to the underlying modules.
- **`prisma/`**: Contains the `schema.prisma` file, which defines the database schema, and migration files.

## 3. Data Model (Prisma Schema)

The database schema is defined in `prisma/schema.prisma` and includes the following key models:

- **`User`**: Stores user information, including their `role`.
- **`Role`**: An enum defining user roles (`SUPER_ADMIN`, `ADMIN`, `USER`, etc.).
- **`Post`**: Represents a blog article with fields like `title`, `slug`, `content`, `published`, and relations to `User` (author) and `Category`.
- **`Category`**: For organizing blog posts.

This structure is robust and ready for expansion with property-related models.

## 4. Core Functionalities (End-to-End Flows)

### a. Authentication & Authorization

- **Flow**: Login is handled by a custom `/auth/login` page. It uses the `CredentialsProvider` from NextAuth.js to validate user email and password against the database via the `PrismaAdapter`.
- **Session Management**: The session strategy is `jwt`. The user's `id` and `role` are encoded into the JWT, making them available in both server components (via `getServerSession`) and client components (via `useSession`).
- **Authorization**: Role-based access control is enforced by `src/middleware.ts`. It protects all `/admin/*` routes, ensuring only users with the `ADMIN` role can access them. Unauthorized users are redirected.

### b. Blog & Content Management

This is the most developed module and serves as a blueprint for others.

- **Public View (`/blogs`)**:

  1.  The `src/app/(frontend)/blogs/page.tsx` Server Component fetches all published posts.
  2.  It calls the `getPublishedPosts()` function directly from `src/modules/blog/services/post.service.ts`.
  3.  The service queries the database using Prisma for posts where `published` is `true`.
  4.  The posts are rendered on the server and sent to the client as static HTML, providing excellent performance and SEO.

- **Admin View (`/admin/blog`)**:

  1.  Access is protected by the middleware.
  2.  The `src/app/(frontend)/admin/blog/page.tsx` component checks for a valid session and appropriate role (`ADMIN`, `EDITOR`, `WRITER`).
  3.  It fetches **all** posts (published or not) by making an authenticated API call to `/api/posts`.
  4.  The data is passed to the `<BlogList />` client component, which handles the interactive UI for managing posts.

- **Creating & Editing Posts**:
  1.  The `PostForm.tsx` component provides the UI for creating and editing posts, including a TipTap-based rich text editor.
  2.  It uses `react-hook-form` with `@hookform/resolvers/zod` to validate form data against the `postFormSchema`.
  3.  Client-side state (like auto-save status) is managed by a Zustand store (`usePostStore`).
  4.  On submission, the form calls the `/api/posts` endpoint. The route handler then uses the `post.service` to validate the data again with Zod (ensuring server-side safety) and create/update the post in the database using Prisma.

This end-to-end flow demonstrates a robust, type-safe, and secure implementation that separates concerns effectively. The project is well-structured and ready for the development of new features.
