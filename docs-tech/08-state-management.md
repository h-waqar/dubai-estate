# State Management

## Server State (Primary)
- **RSC (React Server Components)**: Fetch initial data.
- **Server Actions**: Mutate data.
- **URL Search Params**: Used for filter state (pagination, sorting, search queries) to ensure shareable URLs.

## Client State (Secondary)
- **Zustand**: Used for global UI state where prop drilling is cumbersome.
    - `useLocationStore`: Manages location filtering context.
    - `counterStore`: Example/Test store.
- **React Context**: Used for Theme (`ThemeProvider`) and Session (`SessionProvider`).

## Caching
- **Next.js Cache**: `revalidatePath` is crucial after mutations (e.g., `createPropertyAction`) to purge the Server Component cache.
