// src\components\posts\TagsInput.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { PostFormData } from "../types/post.types";

interface TagsInputProps {
  watch: UseFormWatch<PostFormData>;
  setValue: UseFormSetValue<PostFormData>;
}

export function TagsInput({ watch, setValue }: TagsInputProps) {
  const [input, setInput] = useState("");
  const tags = watch("tags") || [];

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setValue("tags", [...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  return (
    <div>
      <Label className="block text-sm font-medium mb-2">Tags</Label>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              className="font-bold hover:text-red-500"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a tag"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
}
