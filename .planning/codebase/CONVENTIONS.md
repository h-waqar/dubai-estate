# Coding Conventions

**Analysis Date:** 2025-03-26

## Naming Patterns

**Files:**
- `kebab-case.tsx` for generic UI components: `app/src/components/ui/alert-dialog.tsx`
- `PascalCase.tsx` for layout and domain-specific components: `app/src/components/layout/Header.tsx`, `app/src/modules/blog/components/BlogList.tsx`
- `kebab-case.ts` for hooks, types, and validators: `app/src/hooks/use-debounce.ts`, `app/src/types/featured-properties.ts`, `app/src/validators/contact.ts`
- `[name].actions.ts` for module-specific server actions: `app/src/modules/blog/actions/category.actions.ts`

**Functions:**
- `camelCase` for server actions, hooks, and utility functions: `registerUser`, `useAuth`, `handleApiError`.
- `PascalCase` for React components: `export default function Header()`.

**Variables:**
- `camelCase` for standard variables and state.
- `UPPER_SNAKE_CASE` for constants (e.g., environment variables and configuration constants).

**Types:**
- `PascalCase` for Interfaces and Types: `interface NavItem`, `type ContactFormInput`.

## Code Style

**Formatting:**
- No explicit Prettier configuration detected. Standard formatting consistent with Next.js development patterns.
- Tailwind CSS used for styling throughout the codebase.

**Linting:**
- ESLint configured in `app/eslint.config.mjs` with `typescript-eslint` and `eslint-config-next`.
- Rules include standard Next.js recommended rules and `@typescript-eslint/no-unused-vars: warn`.

## Import Organization

**Order:**
1. React/Next.js core modules
2. Third-party libraries (e.g., `lucide-react`, `zod`, `zustand`)
3. Components/Actions from path aliases (`@/components/ui/...`)
4. Types/Interfaces
5. Relative imports

**Path Aliases:**
- `@/*`: `./src/*` (e.g., `@/lib/prisma`, `@/components/ui/button`)
- `&/`: `./public/*` (e.g., `&/assets/...`)

## Error Handling

**Patterns:**
- **API Routes:** Handled via `handleApiError` utility in `app/src/lib/errorHandler.ts`. It catches `ZodError` and `PrismaClientKnownRequestError`.
- **Server Actions:** Return an object with either `{ error: string }` or `{ success: true, ... }`: `app/src/actions/auth.ts`.
- **Client Side:** Use `sonner` for toast notifications: `app/src/components/ui/sonner.tsx`.

## Logging

**Framework:** `console`

**Patterns:**
- `console.error` used in catch blocks to log server-side errors before returning to client: `app/src/actions/auth.ts`.
- `console.log` used for debugging database errors in `app/src/lib/errorHandler.ts`.

## Comments

**When to Comment:**
- Use section markers in larger files: `// --- Section ---`.
- Step-by-step logic in complex functions: `// 1. Validate Inputs`.
- Purpose of complex schemas in validators: `app/src/validators/contact.ts`.

**JSDoc/TSDoc:**
- Minimal use, but present in some configuration files.

## Function Design

**Size:** Generally modular, with logic split between components and server actions.

**Parameters:** Prefer `formData` for server actions where applicable, or typed objects for utilities.

**Return Values:** Standardized error/success objects for mutations.

## Module Design

**Exports:**
- Named exports for utilities and multiple actions in one file: `app/src/actions/auth.ts`.
- Default exports for React components: `app/src/components/layout/Header.tsx`.

**Barrel Files:**
- Not extensively used, components are typically imported directly from their respective files.

---

*Convention analysis: 2025-03-26*
