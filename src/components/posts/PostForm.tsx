// src\components\posts\PostForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postFormSchema,
  type PostFormData,
  defaultPostFormData,
} from "@/types/post";
import { usePostStore } from "@/stores/usePostStore";
import { BlogEditor } from "@/components/posts/Editor";
import { CoverImageInput } from "@/components/posts/CoverImageInput";
import { CategorySelect } from "@/components/posts/CategorySelect";
import { TagsInput } from "@/components/posts/TagsInput";
import { PreviewModal } from "@/components/posts/PreviewModal";
import { api } from "@/lib/api";

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

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formDefaultValues: PostFormData = {
    ...defaultPostFormData,
    ...post,
  };

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: formDefaultValues,
  });

  const { watch, setValue, handleSubmit, formState } = form;

  const htmlContent = watch("content") || "";

  // --- Sync form → Zustand store
  useEffect(() => {
    const subscription = watch((values) => {
      const safeValues = {
        ...values,
        tags: values.tags?.filter((t): t is string => !!t) ?? [],
      };
      setPost(safeValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, setPost]);

  // --- Auto-save effect
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
    const normalized = {
      ...data,
      categoryId: data.categoryId || null,
      coverImage: data.coverImage || "https://picsum.photos/1200/630",
      excerpt: data.excerpt || "",
    };

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/posts", normalized);
      const savedPost = res.data;

      setSuccess("Post saved successfully!");
      markSaved();
      console.log("✅ Saved Post:", savedPost);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong while saving";
      setError(message);
      console.error("❌ Save Post Error:", message, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Example categories (replace with API fetch)
  const categories = [
    { id: "1", name: "Tech" },
    { id: "2", name: "Lifestyle" },
    { id: "3", name: "Business" },
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Header --- */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Write Blog Post</h2>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            👁️ Preview
          </button>
        </div>

        {/* --- Title --- */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            {...form.register("title")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Enter your blog title..."
          />
          {formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.title.message}
            </p>
          )}
        </div>

        {/* --- Slug --- */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            {...form.register("slug")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="blog-post-url-slug"
          />
          {formState.errors.slug && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.slug.message}
            </p>
          )}
        </div>

        {/* --- Category --- */}
        <CategorySelect categories={categories} />

        {/* --- Cover Image --- */}
        <CoverImageInput
          register={form.register}
          error={formState.errors.coverImage}
        />

        {/* --- Tags --- */}
        <TagsInput watch={watch} setValue={setValue} />

        {/* --- Content Editor --- */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <BlogEditor
            value={htmlContent}
            onChange={(html) =>
              setValue("content", html, { shouldValidate: true })
            }
          />
          {formState.errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.content.message}
            </p>
          )}
        </div>

        {/* --- Publish --- */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...form.register("published")}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Publish immediately</span>
        </div>

        {/* --- Submit --- */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || formState.isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
          >
            {saving || formState.isSubmitting ? "Saving..." : "Save Post"}
          </button>

          {saving && (
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <span className="animate-spin">⏳</span> Auto-saving...
            </span>
          )}
          {post.lastSavedAt && !saving && (
            <span className="text-sm text-green-600">
              ✓ Saved at {new Date(post.lastSavedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </form>

      {/* --- Preview Modal --- */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={watch("title")}
        slug={watch("slug")}
        content={htmlContent}
      />
    </FormProvider>
  );
}
