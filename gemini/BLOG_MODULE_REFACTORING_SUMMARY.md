# Blog Module Refactoring Summary

This document summarizes the refactoring process for the `blog` module, detailing the problems encountered, the planned solutions, the bugs that arose during implementation, and how they were patched.

## Problem Statement

The primary goal was to refactor the `blog` module to adhere to a modular architecture, improve error handling, ensure type consistency, and resolve issues related to post creation and category management. Specific problems included:
1.  Inconsistent type definitions for `Post` and `Category` across the application.
2.  Issues with passing `Date` objects between server and client components.
3.  The "Save Post" button in the `PostForm` not functioning correctly, often due to validation errors or missing `authorId`.
4.  Generic error messages being displayed to the user, making debugging difficult.
5.  Runtime errors in `BlogList.tsx` due to incorrect rendering of category objects.

## Initial Plan

1.  **Refactor API routes to use services:** Move business logic from API routes (`src/app/api/...`) to dedicated service files within the `blog` module (`src/modules/blog/services`).
2.  **Ensure type consistency:** Standardize `Post` and `Category` interfaces and their relations across the frontend and backend.
3.  **Improve error handling and display:** Implement centralized API error handling and ensure specific error messages are propagated to the frontend.
4.  **Address `PostForm` functionality:** Ensure post creation works correctly, including proper `authorId` assignment and category selection.

## Bugs Encountered and Patches

### 1. Type Mismatch in `BlogsPage.tsx` and `post.service.ts`

*   **Problem:**
    *   `PostWithRelations[]` was not assignable to `Post[]` in `BlogsClient`.
    *   The `author` property in `PostWithRelations` was non-nullable, but Prisma could return `null`.
    *   `createdAt` and `updatedAt` were typed as `string` in the `Post` interface but were `Date` objects from Prisma.
*   **Patch:**
    *   Updated `PostWithRelations` in `src/modules/blog/types/post.types.ts` to allow `author` to be `null`.
    *   Updated `Post` interface in `src/modules/blog/types/post.types.ts` to have `createdAt` and `updatedAt` as `Date` objects.
    *   Updated `BlogsClient.tsx` to expect `PostWithRelations[]` for `initialPosts`.
    *   Refactored `post.service.ts` to select author fields directly within the Prisma query, removing manual mapping.

### 2. Date Serialization Issue

*   **Problem:** `Type 'Date | null' is not assignable to type 'string | null'` for `publishedAt` when passing data from server components to client components. This occurred because `Date` objects are not directly serializable by Next.js when passed as props to client components.
*   **Patch:**
    *   Reverted `publishedAt`, `createdAt`, and `updatedAt` in the `Post` interface (`src/modules/blog/types/post.types.ts`) back to `Date | null` and `Date` respectively, to maintain consistency with Prisma's return types.
    *   Removed the explicit date-to-string conversion in `BlogsPage.tsx`, relying on Next.js's automatic serialization of `Date` objects to ISO strings when passing props to client components.

### 3. `PostForm` Submission Issues (Missing `authorId` and Generic 400/500 Errors)

*   **Problem:**
    *   The "Save Post" button was unresponsive, and `onError` was initially called with an empty `errors` object.
    *   API requests to `/api/posts` failed with `400 Bad Request` due to `authorId: ["Invalid input: expected number, received undefined"]`.
    *   The `userId` from the session was not correctly propagated or typed.
*   **Patch:**
    *   **Category Fetching:** Fixed `getCategories` function in `src/app/(frontend)/admin/blog/new/page.tsx` to correctly parse the API response (`res.data.data`).
    *   **`authorId` Type Discrepancy:**
        *   Updated `next-auth.d.ts` to define `id` as `number` in `Session`, `User`, and `JWT` interfaces to align with Prisma's `Int` type.
        *   Updated `src/app/api/dev/login/route.ts` to use the numeric `user.id` directly.
        *   Updated `src/app/api/posts/route.ts` to parse `decoded.sub` to `parseInt` for JWT fallback.
        *   Updated `src/modules/user/routes/auth.ts` `authorize` and `session` callbacks to correctly handle and assign numeric `id` to `token.id` and `session.user.id`.
        *   **Root Cause of `authorId` undefined:** Discovered that the `user` object in the `jwt` callback was `undefined` because the `authorize` function was not returning a `User` object. This was due to a subtle issue in how NextAuth populates the `user` object in the `jwt` callback.
        *   **Final `authorId` Fix:** Ensured `token.id` is correctly set in the `jwt` callback by explicitly assigning `user.id` to `token.id`.
    *   **`PostForm` `authorId` Handling:**
        *   Refactored `PostForm.tsx` to use a new `useAuth` hook (`src/modules/user/hooks/useAuth.ts`) to retrieve `userId` and `userRole`, centralizing authentication logic and removing the need to pass `userId` as a prop.
        *   Removed `userId` prop from `NewPostPage.tsx` and `EditPost.tsx`.
        *   Modified `src/modules/blog/validators/post.validator.ts` to make `authorId` optional in `postSchema`.
        *   Modified `src/app/api/posts/route.ts` to use `token.id` as a fallback for `authorId` if `data.authorId` is not provided in the request payload.
        *   Explicitly created the `payload` object in `PostForm.tsx` to ensure `authorId` is always included.
        *   **Prisma `author` Relation:** Fixed `prisma.post.create` invocation in `src/app/api/posts/route.ts` to use `author: { connect: { id: token.id } }` instead of `authorId` directly, as Prisma expects relation handling.
        *   Removed the redundant `categoryId: data.categoryId` field from the `prisma.post.create` data object, as it's handled by the `category` connect relation.

### 4. Generic Error Message on Frontend

*   **Problem:** API returned `500 Internal Server Error` for unique slug constraint violations, and the frontend displayed a generic "Request failed with status code 500".
*   **Patch:**
    *   Modified `src/app/api/posts/route.ts` to use `handleApiError` from `src/lib/errorHandler.ts` to specifically catch `PrismaClientKnownRequestError` (e.g., `P2002` for unique constraint violations) and return a `409 Conflict` with a more informative message ("Duplicate entry").
    *   Modified `src/modules/blog/components/PostForm.tsx` to extract specific error messages from the `AxiosError` response, handling cases where the error is a string, an object with a message property, or contains field-specific errors (e.g., for `slug` or `authorId`).
    *   Added the `Toaster` component to `src/app/(frontend)/admin/layout.tsx` to ensure toast notifications are displayed.

### 5. `BlogList.tsx` Runtime Error

*   **Problem:** `Objects are not valid as a React child` when rendering `post.category` directly inside a `Badge` component.
*   **Patch:** Modified `src/modules/blog/components/BlogList.tsx` to render `post.category.name` instead of `post.category`.

## Current Status

All identified issues have been addressed, and the application should now be functioning correctly with proper error handling and type consistency. The build is successful, and the frontend displays specific error messages for validation failures.
