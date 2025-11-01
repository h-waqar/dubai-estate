// src/modules/property/components/PropertyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPropertyValidator } from "../validators/createProperty.validator";
import { CreatePropertyInput } from "../types/property.types";
import { createPropertyAction } from "../actions/createProperty";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Import other UI components as needed (Select, Label, etc.)

export function PropertyForm() {
  const form = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertyValidator),
    defaultValues: {
      title: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      location: "",
      description: "",
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
      toast.success("Property created successfully!");
      form.reset();
    } else {
      // Handle validation errors or other failures
      if (typeof result.error === "string") {
        toast.error(`Error: ${result.error}`);
      } else {
        // Log validation errors to the console for now
        console.error("Validation errors:", result.error);
        toast.error("Please check the form for errors.");
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Title</label>
        <Input {...form.register("title")} />
        {formState.errors.title && (
          <p className="text-red-500">{formState.errors.title.message}</p>
        )}
      </div>

      <div>
        <label>Price</label>
        <Input type="number" {...form.register("price")} />
        {formState.errors.price && (
          <p className="text-red-500">{formState.errors.price.message}</p>
        )}
      </div>

      {/*
        ADD THE REST OF THE FORM FIELDS HERE
        (bedrooms, bathrooms, location, description, propertyTypeId, furnishing, etc.)
        Use Shadcn UI components like Select for enums and relations.
      */}

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Creating..." : "Create Property"}
      </Button>
    </form>
  );
}
