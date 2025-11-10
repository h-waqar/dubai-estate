// src/components/MinimalForm.tsx
"use client";

// --- React & Library Imports ---
import { useState } from "react"; // <-- IMPORT useState
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image"; // <-- IMPORT Image
import { X } from "lucide-react"; // <-- IMPORT Icon

// --- Our Schema/Type Imports ---
import { profileValidator, type ProfileInput } from "@/lib/profile.validator";

// --- Our Action Import ---
import { createProfileAction } from "@/app/actions";

// --- Media Library Imports ---
// (Assuming these are the correct paths)
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import { Media } from "@/modules/media/types/media.types";

// --- Shadcn UI Component Imports ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function MinimalForm() {
  // 1. INITIALIZE THE FORM
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileValidator),
    defaultValues: {
      username: "",
      email: "",
      age: 0,
      coverImageId: undefined, // <-- ADD new field to defaults
    },
  });

  // 2. LOCAL STATE FOR PREVIEW
  // React Hook Form will store the 'coverImageId'.
  // We need a separate local state to hold the *full media object*
  // (with the URL, title, etc.) just for displaying the preview.
  const [coverPreview, setCoverPreview] = useState<Media | null>(null);

  // 3. DEFINE THE SUBMIT HANDLER
  async function onSubmit(values: ProfileInput) {
    // 'values' now contains 'coverImageId'
    // e.g., { username: "Hamza", age: 30, coverImageId: 123 }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      // 'value' could be 'undefined' (for optional fields)
      if (value != null) {
        formData.append(key, String(value));
      }
    });

    const result = await createProfileAction(formData);

    // 4. HANDLE THE RESPONSE
    if (result.success) {
      toast.success("Profile created!");
      form.reset(); // This resets RHF's state (coverImageId -> undefined)
      setCoverPreview(null); // <-- MANUALLY reset our local preview state
    } else {
      toast.error(result.error || "An unknown error occurred.");
    }
  }

  // 5. RENDER THE FORM
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* --- USERNAME FIELD --- */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- EMAIL FIELD --- */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- AGE FIELD (Number Handling) --- */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Your age"
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- 6. MEDIA LIBRARY FIELD INTEGRATION --- */}
        <FormField
          control={form.control}
          name="coverImageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              {/* This 'FormControl' is just a wrapper.
                The 'MediaLibraryButton' is now our "input".
              */}
              <FormControl>
                <div>
                  <MediaLibraryButton
                    mode="select"
                    buttonText={
                      field.value ? "Change Cover Image" : "Select Cover Image"
                    }
                    // 7. THE INTEGRATION MAGIC
                    // When a user selects media, your component
                    // calls 'onSelect' with the 'media' object.
                    onSelect={(media: Media) => {
                      // We update RHF's state with the ID
                      field.onChange(media.id);
                      // We update our local state with the full object
                      // so we can show a preview.
                      setCoverPreview(media);
                    }}
                  />
                </div>
              </FormControl>

              {/* 8. PREVIEW & REMOVE LOGIC
                  We use our local 'coverPreview' state to show
                  what's been selected.
              */}
              {coverPreview && (
                <div className="mt-4 relative inline-block">
                  <div className="w-48 h-48 relative">
                    <Image
                      src={coverPreview.url}
                      alt={coverPreview.alt || coverPreview.title || "Cover"}
                      fill
                      sizes="192px"
                      className="object-cover rounded-lg border"
                    />
                  </div>
                  <button
                    type="button" // <-- IMPORTANT: type="button"
                    onClick={() => {
                      // 9. CLEARING THE VALUE
                      // We clear RHF's state
                      field.onChange(undefined);
                      // And we clear our local preview state
                      setCoverPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    {coverPreview.title}
                  </p>
                </div>
              )}

              {/* This will show Zod errors for 'coverImageId' if you add any */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
