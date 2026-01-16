# Architecture

## Domain-Driven Design (DDD) Light

The project uses a modular structure inside `src/modules` to separate business logic from the UI.

### Module Structure (`src/modules/[module-name]`)

Each module (e.g., `pricing`, `property`) typically contains:
- `actions/`: Server Actions for this domain.
- `components/`: Domain-specific UI components.
- `services/`: Business logic layer (interaction with Prisma/External APIs).
- `validators/`: Zod schemas for input validation.
- `types/`: TypeScript interfaces.

### Data Flow

1.  **User Interaction**: User submits a form (Client Component).
2.  **Server Action**: `src/actions/*` or `src/modules/*/actions/*` is called.
3.  **Validation**: Zod schema validates input.
4.  **Service Layer**: Service calls Prisma or External API (PayPal, Email).
5.  **Database**: PostgreSQL is updated.
6.  **Response**: Server Action returns result to Client Component.
7.  **UI Update**: `revalidatePath` triggers UI refresh.

### Server-Side Rendering (SSR)

- **Data Fetching**: Done primarily in Server Components using direct Prisma calls or cached Service functions.
- **Client Components**: Used only when interactivity (`useState`, `useEffect`) is needed.

### File Organization

- **Global UI**: `src/components/ui` (shadcn).
- **Global Libs**: `src/lib` (shared infrastructure).
- **Pages**: `src/app` (routing only, delegates logic to modules).
