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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PropertyFormProps {
  propertyTypes: { id: number; name: string }[];
}

/**
 * PropertyForm Component - CLEAN & TYPE-SAFE ✅
 *
 * Key Learning Points:
 *
 * 1. NO z.coerce in the client validator = Clean TypeScript types
 * 2. Use valueAsNumber for number inputs = Browser converts for us
 * 3. Use parseInt for Select components = Manual conversion
 * 4. Server action uses DIFFERENT validator with z.coerce for FormData
 *
 * This approach separates concerns:
 * - Client: Works with proper types (numbers)
 * - Server: Handles string conversion from FormData
 */
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
      propertyTypeId: 0,
    },
  });

  async function onSubmit(values: CreatePropertyInput) {
    // Convert to FormData for server action
    const formData = new FormData();
    console.log(formData);

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
      const errorMsg =
        typeof result.error === "string"
          ? result.error
          : "An unknown error occurred.";
      toast.error(`Error: ${errorMsg}`);
      console.error("Form submission error:", result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Luxury 2-Bedroom Apartment in Downtown"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (AED)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2000000"
                    value={field.value || ""}
                    onChange={(e) => {
                      // valueAsNumber returns NaN for empty string
                      // We default to 0 to keep it a number
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Type Field */}
          <FormField
            control={form.control}
            name="propertyTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select
                  onValueChange={(value: string) =>
                    field.onChange(parseInt(value, 10))
                  }
                  value={field.value ? String(field.value) : ""}
                >
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
          {/* Bedrooms Field */}
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bathrooms Field */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Furnishing Field */}
          <FormField
            control={form.control}
            name="furnishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Furnishing Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FurnishingStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) +
                          status.slice(1).toLowerCase().replace("_", "-")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Field */}
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

        {/* Description Field */}
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
          {form.formState.isSubmitting
            ? "Creating Property..."
            : "Create Property"}
        </Button>
      </form>
    </Form>
  );
}
