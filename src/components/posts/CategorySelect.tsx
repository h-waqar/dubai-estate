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
import type { PostFormData } from "@/types/post";

interface CategorySelectProps {
  categories: { id: string; name: string }[];
}

export function CategorySelect({ categories }: CategorySelectProps) {
  const { control } = useFormContext<PostFormData>();

  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => (
        <Select {...field}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
