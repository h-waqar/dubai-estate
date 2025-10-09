// src\components\posts\PostForm.tsx
"use client";

import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePostStore } from "@/stores/usePostStore";
import type { PostFormData } from "@/types/post";
import type { Resolver } from "react-hook-form";

// Zod schema
const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().default(""), // default empty string
  tags: z.array(z.string()).default([]), // always an array of strings
  categoryId: z.string().default(""), // default empty string
  coverImage: z.string().default(""), // default empty string
  published: z.boolean().default(false),
  lastSavedAt: z.string().optional(),
  draftId: z.union([z.string(), z.number()]).optional(),
});

const resolver: Resolver<PostFormData> = zodResolver(postSchema);

// --- Component ---
export function PostForm() {
  const {
    post,
    setPost,
    setLoading,
    setError,
    setSuccess,
    autoSaveEnabled,
    saving,
    startSaving,
    stopSaving,
    markSaved,
  } = usePostStore();

  const form = useForm<PostFormData>({
    resolver,
    // resolver: zodResolver(postSchema),
    defaultValues: post,
  });

  // Sync form -> Zustand
  useEffect(() => {
    const subscription = form.watch((values) => {
      const safeValues: Partial<PostFormData> = {
        ...values,
        tags: values.tags?.filter((t): t is string => !!t) ?? [],
      };
      setPost(safeValues);
    });
    return () => subscription.unsubscribe();
  }, [form, setPost]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled) return;
    const timeout = setTimeout(() => {
      startSaving();
      setTimeout(() => {
        markSaved();
        stopSaving();
        setSuccess(`Auto-saved at ${new Date().toLocaleTimeString()}`);
      }, 1000);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [post, autoSaveEnabled, startSaving, stopSaving, markSaved, setSuccess]);

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Submitting post:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Post saved successfully!");
      markSaved();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          {...form.register("title")}
          className="w-full border rounded p-2"
          placeholder="Enter title"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          {...form.register("slug")}
          className="w-full border rounded p-2"
          placeholder="example-slug"
        />
        {form.formState.errors.slug && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.slug.message}
          </p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          {...form.register("content")}
          className="w-full border rounded p-2 min-h-[150px]"
          placeholder="Write your content here..."
        />
        {form.formState.errors.content && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      {/* Published toggle */}
      <div className="flex items-center space-x-2">
        <input type="checkbox" {...form.register("published")} />
        <span>Published</span>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Post"}
      </button>

      {/* Status */}
      {form.formState.isSubmitting && <p>Saving...</p>}
      {post.lastSavedAt && (
        <p className="text-sm text-gray-500">
          Last saved at {new Date(post.lastSavedAt).toLocaleTimeString()}
        </p>
      )}
    </form>
  );
}
