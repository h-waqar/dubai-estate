# Complete `PropertyForm.tsx` with Shadcn UI

Here is the complete, theme-aware code for the property form. It uses the idiomatic `Form` components from Shadcn UI for proper styling, accessibility, and validation messages.

---

## 1. Parent Page (Data Fetching)

First, you need a page to host the form. This Server Component will fetch the `propertyTypes` from the database and pass them to the form component.

**Create this file: `src/app/(frontend)/admin/properties/new/page.tsx`**
```tsx
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/modules/property/components/PropertyForm";

export default async function NewPropertyPage() {
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Property</h1>
        <p className="text-muted-foreground mb-8">Fill out the details below to add a new listing.</p>
        <PropertyForm propertyTypes={propertyTypes} />
      </div>
    </div>
  );
}
```

---

## 2. Complete `PropertyForm.tsx` Code

Now, replace the content of `src/modules/property/components/PropertyForm.tsx` with the following complete code.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FurnishingStatus } from "@/generated/prisma";

import { createPropertyValidator } from "../validators/createProperty.validator";
import type { CreatePropertyInput } from "../types/property.types";
import { createPropertyAction } from "../actions/createProperty";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PropertyFormProps {
  propertyTypes: { id: number; name: string }[];
}

export function PropertyForm({ propertyTypes }: PropertyFormProps) {
  const form = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertyValidator),
    defaultValues: {
      title: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      location: "",
      description: "",
      furnishing: "UNFURNISHED",
      propertyTypeId: undefined,
    },
  });

  async function onSubmit(values: CreatePropertyInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });

    const result = await createPropertyAction(formData);

    if (result.success) {
      toast.success("Property created successfully!");
      form.reset();
    } else {
      const errorMsg = typeof result.error === 'string' ? result.error : "An unknown error occurred.";
      toast.error(`Error: ${errorMsg}`);
      console.error("Form submission error:", result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Luxury 2-Bedroom Apartment in Downtown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (AED)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="furnishing"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Furnishing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select furnishing status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Object.values(FurnishingStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase().replace('_', '-')}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dubai Marina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the property..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? "Creating Property..." : "Create Property"}
        </Button>
      </form>
    </Form>
  );
}

```
