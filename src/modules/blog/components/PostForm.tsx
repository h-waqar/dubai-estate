// src\components\posts\PostForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  FormProvider,
  Controller,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  postFormSchema,
  type PostFormData,
  defaultPostFormData,
} from "@/modules/blog/types/post.types";
import { usePostStore } from "@/modules/blog/stores/usePostStore";
import { BlogEditor } from "./Editor";
import { CoverImageInput } from "./CoverImageInput";
import { CategorySelect } from "./CategorySelect";
import { TagsInput } from "./TagsInput";
import { PreviewModal } from "./PreviewModal";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { useAuth } from "@/modules/user/hooks/useAuth";
import { handleClientError } from "@/lib/handleClientError";

export function PostForm({
  initialData,
  categories,
}: {
  initialData?: Partial<PostFormData> & { id?: number };
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const { userId } = useAuth();
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
    resetPost,
  } = usePostStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ✅ Merge defaults with initialData or post
  const defaultValues: PostFormData = {
    ...defaultPostFormData,
    ...initialData,
    ...post,
  };

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, formState, control } = form;

  const htmlContent = watch("content") || "";
  const title = watch("title");

  // --- Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData?.id) { // Only auto-generate for new posts or if explicit logic added
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [title, setValue, initialData]);

  // --- Sync form → Zustand store
  useEffect(() => {
    const subscription = watch((values) => {
      setPost(values as PostFormData);
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
    if (!userId) {
      toast.error("You must be logged in to save a post");
      return;
    }

    const payload = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || "https://picsum.photos/1200/630",
      categoryId: data.categoryId || null,
      tags: data.tags,
      published: data.published,
      authorId: userId,
    };

    console.log("Payload:", payload);

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/posts", payload);
      const savedPost = res.data;

      setSuccess("Post saved successfully!");
      markSaved();
      console.log("✅ Saved Post:", savedPost);

      // Clear the form data from local storage
      resetPost();

      // Redirect to admin blog list to prevent duplicate submissions
      router.push("/admin/blog");
    } catch (err: unknown) {
      const error = handleClientError(err);
      setError(error.message);
      toast.error(error.message);
      console.error("❌ Save Post Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onError: SubmitErrorHandler<PostFormData> = (errors) => {
    console.error("❌ Form Errors:", errors);
    toast.error("Please fill all required fields");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* --- Header --- */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Write Blog Post</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                console.log("🗑️ Clear button clicked");
                if (window.confirm("Are you sure you want to clear the form? This action cannot be undone.")) {
                  console.log("Confirmed clear");
                  resetPost();
                  console.log("Resetting form with:", defaultPostFormData);
                  form.reset({ ...defaultPostFormData, coverImage: undefined });
                  toast.success("Form cleared successfully");
                }
              }}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition font-medium"
            >
              🗑️ Clear
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              👁️ Preview
            </button>
          </div>
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

        {/* --- Slug (Auto-generated & Read-only) --- */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            {...form.register("slug")}
            readOnly
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed font-mono text-sm text-muted-foreground"
            placeholder="blog-post-url-slug"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-generated from title
          </p>
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
          control={form.control}
          name="coverImage"
        />

        {/* --- Tags --- */}
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagsInput value={field.value} onChange={field.onChange} />
          )}
        />

        {/* --- Content Editor --- */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <BlogEditor
                value={field.value}
                onChange={field.onChange}
              />
            )}
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
          {post?.lastSavedAt && !saving && (
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
        title={watch("title") || ""}
        slug={watch("slug") || ""}
        content={htmlContent}
      />
    </FormProvider>
  );
}
