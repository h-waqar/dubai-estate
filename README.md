# Dubai Estate

This is a full-stack real estate application built with Next.js, Prisma, and NextAuth.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (based on the `pg` driver in `package.json`)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/) (inferred from `components.json` and `tailwind.config.js`)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Rich Text Editor:** [Tiptap](https://tiptap.dev/)

## Getting Started

### Prerequisites

- Node.js (v20.x or later recommended)
- npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd dubai-estate
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can copy the `.env.example` if it exists.

```env
# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"

# NextAuth
# You can generate a secret with `openssl rand -base64 32`
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### Running the application

1.  Run the database migrations:
    ```bash
    npx prisma migrate dev
    ```

2.  (Optional) Seed the database with initial data:
    ```bash
    npm run seed
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts a production server.
- `npm run db`: Opens Prisma Studio to view and edit your data.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run seed`: Seeds the database with initial data.

## PRISMA COMMANDS

# 1. Update your schema.prisma with new models or changes

# 2. Create a new migration
npx prisma migrate dev --name <migration_name>

# 3. Generate the Prisma client
npx prisma generate

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.