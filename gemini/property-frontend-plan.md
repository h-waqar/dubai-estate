# Plan: `property` Module Frontend

This plan outlines the implementation for the frontend components of the `property` module, starting with the property creation form.

---

## 1. Next Step: `PropertyForm.tsx`

The most critical component to build next is `src/modules/property/components/PropertyForm.tsx`. This component will allow users (with the correct role) to input property details and save them to the database using the `createPropertyAction` you already built.

### Implementation Guide:

1.  **Use `react-hook-form`**: Manage form state, validation, and submission.
2.  **Use `zodResolver`**: Connect your `createPropertyValidator` directly to the form to get real-time validation.
3.  **Call Server Action**: In the `onSubmit` handler, call the `createPropertyAction` with the form data.
4.  **Handle State**: Use the form's `isSubmitting` state to show loading indicators and display any errors returned from the server action.

---

## 2. Code Hint: `PropertyForm.tsx` Skeleton

Here is a skeleton to get you started. You will need to add the actual form fields (`Input`, `Select`, etc.) for each property attribute.

```tsx
// src/modules/property/components/PropertyForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPropertyValidator, CreatePropertyInput } from '../validators/createProperty.validator';
import { createPropertyAction } from '../actions/createProperty';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Import other UI components as needed (Select, Label, etc.)

export function PropertyForm() {
  const form = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertyValidator),
    defaultValues: {
      title: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      location: '',
      description: '',
      // Add other default values
    },
  });

  const { formState } = form;

  async function onSubmit(values: CreatePropertyInput) {
    const formData = new FormData();
    // Append all form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });

    const result = await createPropertyAction(formData);

    if (result.success) {
      toast.success('Property created successfully!');
      form.reset();
    } else {
      // Handle validation errors or other failures
      if (typeof result.error === 'string') {
        toast.error(`Error: ${result.error}`);
      } else {
        // Log validation errors to the console for now
        console.error("Validation errors:", result.error);
        toast.error('Please check the form for errors.');
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Title</label>
        <Input {...form.register('title')} />
        {formState.errors.title && <p className="text-red-500">{formState.errors.title.message}</p>}
      </div>

      <div>
        <label>Price</label>
        <Input type="number" {...form.register('price')} />
        {formState.errors.price && <p className="text-red-500">{formState.errors.price.message}</p>}
      </div>

      {/* 
        ADD THE REST OF THE FORM FIELDS HERE 
        (bedrooms, bathrooms, location, description, propertyTypeId, furnishing, etc.)
        Use Shadcn UI components like Select for enums and relations.
      */}

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Creating...' : 'Create Property'}
      </Button>
    </form>
  );
}

```

---

## ✅ Next Step

Implement the full `PropertyForm.tsx` component using the skeleton above. You will need to create a new page (e.g., `/admin/properties/new`) to render this form.
