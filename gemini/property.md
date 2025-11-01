# Plan: `property` Module (Implementation)

This revised plan focuses on implementing the logic within your existing `property` module files. We will follow the excellent pattern established by the `blog` module: defining data contracts first (Types & Validators), then implementing the core business logic (Services), exposing it securely (Actions), and finally building the UI (Components & Stores).

---

## 1. Module Implementation Steps

Here is the recommended order of implementation for your existing files.

1.  **Validators & Types (`validators/`, `types/`):**
    *   Define Zod schemas in `validators/createProperty.validator.ts` and `validators/propertyFilter.validator.ts` to enforce data consistency.
    *   In `types/property.types.ts`, infer TypeScript types from these Zod schemas and define any additional interfaces (e.g., `PropertyWithRelations`).

2.  **Service Layer (`services/service.ts`):**
    *   Implement all Prisma database logic here. Create functions like `createProperty`, `getProperties`, `updatePropertyStatus`, etc. This layer should be pure business logic, with no awareness of Next.js requests or responses.

3.  **Server Actions (`actions/`):**
    *   In files like `actions/createProperty.ts`, import functions from your service.
    *   Handle user authentication/authorization (e.g., check for `AGENT` or `ADMIN` roles) before calling the service.
    *   Use `revalidatePath` to update the cache after mutations.

4.  **UI Components (`components/`):**
    *   **`PropertyForm.tsx`**: Use `react-hook-form` with `@hookform/resolvers/zod` and the validator from Step 1. Connect it to your `createProperty.ts` server action.
    *   **`PropertyList.tsx`**: Fetch initial data in a server component and pass it to this client component. Manage client-side filtering and pagination state, similar to `BlogList.tsx`.
    *   **`PropertyCard.tsx`**: A display component for a single property.

5.  **Client State (`stores/store.ts`):**
    *   Create a `usePropertyFilterStore` with Zustand to manage complex filter states for `PropertyList.tsx`, just as `usePostStore` manages form state.

---

## 2. TS Hints (Code Snippets)

### Hint 1: Validator & Type (`validators/createProperty.validator.ts`)

This schema is the single source of truth for property creation data.

```ts
import { z } from 'zod';
import { FurnishingStatus } from '@prisma/client';

// In validators/createProperty.validator.ts
export const createPropertyValidator = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  price: z.coerce.number().positive("Price must be a positive number."),
  propertyTypeId: z.coerce.number().int().positive(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  location: z.string().min(5, "Location is required."),
  furnishing: z.nativeEnum(FurnishingStatus).default('UNFURNISHED'),
  description: z.string().optional(),
});

// In types/property.types.ts
import { z } from 'zod';
import { createPropertyValidator } from '../validators/createProperty.validator';

export type CreatePropertyInput = z.infer<typeof createPropertyValidator>;
```

### Hint 2: Prisma Service (`services/service.ts`)

Your service consumes the validated input to interact with the database. Note the `slugify` utility, which you should create in `src/utils/slug.ts`.

```ts
import { prisma } from '@/lib/prisma';
import { CreatePropertyInput } from '../types/property.types';
import { slugify } from '@/utils/slug';
import { PropertyStatus } from '@prisma/client';

export async function createProperty(input: CreatePropertyInput, createdById: number) {
  const slug = await generateUniqueSlug(input.title);

  return prisma.property.create({
    data: {
      ...input,
      slug,
      createdById,
      status: PropertyStatus.DRAFT, // Always default to DRAFT
    },
  });
}

// Helper to ensure slugs are unique
async function generateUniqueSlug(title: string): Promise<string> {
    let slug = slugify(title);
    let count = 1;
    while (await prisma.property.findUnique({ where: { slug } })) {
        slug = `${slugify(title)}-${count}`;
        count++;
    }
    return slug;
}
```

### Hint 3: Server Action (`actions/createProperty.ts`)

This action orchestrates the validation, authorization, and service call. It's called directly from your `PropertyForm.tsx`.

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createPropertyValidator } from '../validators/createProperty.validator';
import * as propertyService from '../services/service';
import { authOptions } from '@/modules/user/routes/auth';
import { getServerSession } from 'next-auth';

export async function createPropertyAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return { success: false, error: "Unauthorized" };
  }

  const data = Object.fromEntries(formData);
  const validation = createPropertyValidator.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  try {
    const property = await propertyService.createProperty(validation.data, session.user.id);
    revalidatePath('/properties');
    return { success: true, property };
  } catch (error) {
    return { success: false, error: "Failed to create property." };
  }
}
```

---

## 3. Test Commands

Since you'll be using Server Actions, the best way to test is by submitting the form in the UI. However, you can test the service layer with a simple script or by temporarily exposing it via an API route.

**Example API Route for testing (`app/api/properties/route.ts`):**
```ts
import { NextResponse } from 'next/server';
import * as propertyService from '@/modules/property/services/service';

export async function GET() {
  const properties = await propertyService.listProperties(); // Assuming you create this function
  return NextResponse.json(properties);
}
```

**Curl command for that test route:**
```bash
cURL -X GET http://localhost:3000/api/properties
```

---

## 4. Gotchas & Best Practices

1.  **Media Handling:** The `Media` and `MediaUsage` models in `prisma.schema` are the correct, modern way to handle images. Avoid using the old `PropertyImage` and `PropertyVideo` models. Your `PropertyForm` will need a component to upload images and associate them.
2.  **Authorization Flow:** The `status` field is critical. Only `ADMIN` or `MANAGER` roles should be able to move a property from `PENDING_REVIEW` to `APPROVED`. Implement this logic in `actions/approveProperty.ts`.
3.  **Component Re-use:** `PropertyCard.tsx` should be a pure display component. The logic for fetching data should live in server components that then use `PropertyList.tsx` and `PropertyCard.tsx`.

---

## ✅ Next Step

Start by implementing the Zod validator in `validators/createProperty.validator.ts` and the corresponding types in `types/property.types.ts`. This will provide the data contract for the rest of the module.