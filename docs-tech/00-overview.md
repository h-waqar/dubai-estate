# Tech Overview

## Project: Dubai Estate

**Dubai Estate** is a comprehensive real estate platform for the Dubai market, featuring property listings, off-plan projects, blogging, and a subscription-based model for agents/users to list properties.

## Core Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js (v4)
- **UI**: Tailwind CSS v4, shadcn/ui, Radix UI
- **State**: Server Actions (Mutations), React Server Components (Data Fetching), Zustand (Client State)

## Key Systems

1.  **Property Management**: CRUD for properties with approval workflows.
2.  **Project Management**: Off-plan projects with floorplans, amenities, and progress updates.
3.  **Subscription System**: PayPal integration for tiered pricing plans (`PricingPlan`) that control listing quotas.
4.  **Blog Engine**: Markdown/Tiptap based blog with categories and media management.
5.  **Role-Based Access**: Granular control via `Role` enum (SUPER_ADMIN, ADMIN, USER, etc.).

## Repository Structure

- `src/app`: Next.js App Router (Pages & API Routes).
- `src/modules`: Domain-driven modular architecture (e.g., `pricing`, `property`, `user`).
- `src/actions`: Server Actions for form submissions.
- `src/lib`: Core utilities (Prisma, PayPal, Email).
- `prisma`: Database schema and migrations.
