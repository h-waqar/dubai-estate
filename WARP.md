# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Turbopack (http://localhost:3000)
npm run build        # Build for production with Turbopack
npm start            # Start production server
```

### Database Operations
```bash
npx prisma studio    # Open Prisma Studio GUI (also: npm run db)
npx prisma migrate dev --name <migration_name>  # Create and apply migration
npx prisma generate  # Regenerate Prisma Client after schema changes
npx prisma db push   # Push schema changes without migration (dev only)
```

### Code Quality
```bash
npm run lint         # Run ESLint (configured for Next.js + TypeScript)
```

### Working with Prisma
- After modifying `prisma/schema.prisma`, always run `npx prisma generate` to update the client
- Prisma Client is generated to `src/generated/prisma` (not the default location)
- Import Prisma Client using `@/generated/prisma` in your code

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **React**: 19.1.0
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v4 with JWT sessions and credentials provider
- **Styling**: Tailwind CSS v4 with custom theme system
- **State Management**: Zustand with persist middleware
- **Rich Text**: Tiptap editor with markdown support
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Type Safety**: TypeScript 5 with strict mode disabled

### Path Aliases
- `@/*` → `./src/*`
- `&/*` → `./public/*`

### Authentication System
This application uses a **role-based access control** system with NextAuth.js:

**Roles** (defined in `prisma/schema.prisma`):
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Administrative functions
- `EDITOR` - Content editing and publishing
- `WRITER` - Content creation only
- `MANAGER` - Management features
- `SUPPORT` - Support functions
- `USER` - Basic access

**Key Files**:
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection middleware (protects `/admin/*` routes)
- `src/lib/roleCheck.ts` - Centralized role checking logic
- `src/lib/auth.ts` - Client-side auth helpers

**Session Strategy**: JWT-based sessions (not database sessions)

**Auth Flow**:
1. User logs in via credentials (email/password) at `/auth/login`
2. Password verified with bcrypt against User.password field
3. JWT token issued with user role embedded
4. Protected routes check token and role via middleware
5. API routes validate session and role before allowing operations

**Common Patterns**:
```typescript
// In server components
const session = await getServerSession(authOptions);
if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
  redirect("/unauthorized");
}

// In API routes
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Directory Structure

```
src/
├── app/                         # Next.js App Router
│   ├── (frontend)/             # Route group for public/admin pages
│   │   ├── admin/              # Admin dashboard (protected by middleware)
│   │   │   ├── layout.tsx      # Sidebar/topbar layout for admin
│   │   │   ├── blog/           # Blog management UI
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── users/          # User management
│   │   │   └── settings/       # Settings pages
│   │   ├── auth/               # Authentication pages (login, register)
│   │   ├── blogs/              # Public blog pages
│   │   │   └── [slug]/         # Dynamic blog post pages
│   │   └── properties/         # Property listing pages
│   ├── api/                    # API Routes (Next.js Route Handlers)
│   │   ├── auth/               # NextAuth routes + registration
│   │   ├── posts/              # Blog post CRUD operations
│   │   └── admin/              # Admin-only API endpoints
│   └── styles/                 # Global CSS files
│       ├── theme.css           # Theme variables
│       ├── tiptap-editor.css   # Tiptap editor styles
│       └── prose-styles.css    # Blog content typography
│
├── components/
│   ├── auth/                   # Login/auth modals
│   ├── dashboard/              # Admin dashboard components (Sidebar, Topbar)
│   ├── posts/                  # Blog-related components (Editor, PostForm, etc.)
│   │   ├── Editor.tsx          # Tiptap rich text editor
│   │   ├── PostForm.tsx        # Post creation/edit form
│   │   └── BlogList.tsx        # Admin blog list with filters
│   ├── properties/             # Property listing components
│   ├── sections/               # Homepage sections (Hero, Featured, etc.)
│   ├── layout/                 # Header, Footer, Navigation
│   └── ui/                     # shadcn/ui components
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # Auth utility functions
│   ├── roleCheck.ts            # Role-based access control helpers
│   └── utils.ts                # General utilities (cn, etc.)
│
├── stores/
│   └── usePostStore.ts         # Zustand store for post form state
│
├── types/
│   ├── post.ts                 # Post-related TypeScript types
│   ├── next-auth.d.ts          # NextAuth type extensions
│   └── categories.ts           # Category types
│
├── validators/
│   ├── post.ts                 # Zod schemas for post creation
│   └── postUpdate.ts           # Zod schemas for post updates
│
├── utils/
│   └── slug.ts                 # Slug generation utilities
│
├── middleware.ts               # Next.js middleware for route protection
└── generated/                  # Prisma generated client (DO NOT EDIT)
```

### Database Schema Highlights

**User Model**:
- Supports both OAuth and credentials-based login
- `role` field determines access level
- Related to `Profile` and `Admin` models

**Post Model**:
- SEO-friendly `slug` field (unique)
- `tags` stored as PostgreSQL text array
- `published` boolean with optional `publishedAt` timestamp
- Belongs to `User` (author)

**Key Relationships**:
- User → Posts (one-to-many)
- User → Profile (one-to-one)
- User → Admin (one-to-one)

## Key Patterns and Conventions

### Server vs Client Components
- **Server Components** (default): Used for data fetching, static content, and layouts
- **Client Components** (`"use client"`): Used for interactivity, state, hooks, browser APIs
- Admin pages use server components to fetch data, then pass to client components like `<BlogList />`

### API Route Authentication
All protected API routes follow this pattern:
1. Check session with `getServerSession(authOptions)`
2. Optionally support Bearer token for development (JWT decode)
3. Validate user role against allowed roles
4. Return 401 (Unauthorized) or 403 (Forbidden) as appropriate

### Form Validation
- Use **Zod** schemas defined in `src/validators/`
- Forms integrate with `react-hook-form` using `@hookform/resolvers/zod`
- Type safety: export `z.infer<typeof schema>` types

### State Management
- **Global state**: Zustand stores (e.g., `usePostStore`)
- **Form state**: react-hook-form
- **Server state**: Direct Prisma queries in server components
- **Client state**: React useState/useReducer

### Styling Conventions
- Tailwind utility classes for all styling
- Custom theme variables defined in `src/app/styles/variables.css`
- Dark mode supported via `next-themes`
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### Image Optimization
Next.js Image component configured with remote patterns for:
- `picsum.photos`
- `images.unsplash.com`
- `placehold.co`
- `via.placeholder.com`

Always use `<Image>` component for images, not `<img>` tags.

## Important Configuration Details

### Environment Variables
Required environment variables (create `.env` file):
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."         # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### TypeScript Configuration
- `strict: false` - Strict mode is disabled
- `target: ES2017` - ES2017 syntax support
- ESM modules with `bundler` resolution

### ESLint Configuration
- Configured for Next.js + TypeScript
- Ignores: `.next/`, `src/generated/`, `node_modules/`
- Custom rule: unused vars with `_` prefix are ignored
- Some noisy TypeScript rules are disabled for compatibility

### Prisma Configuration
- **Output path**: `src/generated/prisma` (non-standard location)
- **Database**: PostgreSQL
- **Logging**: All levels enabled in development

### Build Tool
Uses **Turbopack** (Next.js experimental bundler) for faster builds:
- `next dev --turbopack`
- `next build --turbopack`

## Blog System

This app includes a comprehensive blog/CMS system with:
- **Admin UI**: Full CRUD at `/admin/blog`
- **Public Views**: SEO-optimized pages at `/blogs/[slug]`
- **Rich Text Editor**: Tiptap with markdown, code blocks, images
- **Features**: Search, filtering, pagination, draft/publish workflow
- **Permissions**: ADMIN, EDITOR, and WRITER roles can create/edit posts

**API Endpoints**:
- `GET /api/posts` - List posts (with filters)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `PATCH /api/posts/[id]/publish` - Toggle publish status
- `POST /api/posts/[id]/duplicate` - Duplicate post

See `docs/blog/BLOG_SYSTEM_README.md` for detailed documentation.

## Development Workflow

1. **Starting a new feature**:
   - Create feature branch
   - If modifying database: update `prisma/schema.prisma` → run `npx prisma migrate dev`
   - If adding auth: check role requirements in `src/lib/roleCheck.ts`

2. **Working with forms**:
   - Define Zod schema in `src/validators/`
   - Create form component using `react-hook-form`
   - Use `usePostStore` for draft persistence if needed

3. **Adding API routes**:
   - Create in `src/app/api/[endpoint]/route.ts`
   - Add auth checks at the top
   - Validate input with Zod schemas
   - Return proper HTTP status codes

4. **Testing changes**:
   - Start dev server: `npm run dev`
   - Test with different user roles (create test users with different roles)
   - Check Prisma Studio for database state: `npm run db`

## Common Tasks

### Creating a new admin page
1. Create page in `src/app/(frontend)/admin/[page-name]/page.tsx`
2. Add route protection (middleware already protects `/admin/*` for ADMIN role)
3. If other roles need access, update `src/middleware.ts`
4. Add navigation link in `src/components/dashboard/Sidebar.tsx`

### Adding a new database model
1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_model_name`
3. Run `npx prisma generate`
4. Create TypeScript types in `src/types/`
5. Create Zod validators in `src/validators/`
6. Create API routes for CRUD operations

### Changing user roles
Roles can only be changed directly in the database (for security):
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';
```
Or use Prisma Studio: `npm run db`

## Notes
- No test framework currently configured
- Image uploads not implemented (currently using external URLs)
- Email functionality not implemented (no SMTP configuration)
- No rate limiting on API routes (should be added for production)
