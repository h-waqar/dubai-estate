// src\components\posts\CategorySelect.tsx

"use client";

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import type { PostFormData } from "../types/post.types";
import type { PostFormData } from "@/modules/blog/types/post.types";

interface CategorySelectProps {
  categories: { id: number; name: string }[];
}

export function CategorySelect({ categories }: CategorySelectProps) {
  const { control } = useFormContext<PostFormData>();

  //

  // ✅ Add safety check and debug logging
  React.useEffect(() => {
    console.log("CategorySelect received:", {
      categories,
      isArray: Array.isArray(categories),
      type: typeof categories,
    });
  }, [categories]);

  // ✅ Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  //

  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => (
        <Select
          onValueChange={(value) =>
            field.onChange(value ? Number(value) : null)
          }
          value={field.value ? String(field.value) : ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {/* {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))} */}
            {safeCategories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
