// src\components\posts\PostForm.tsx
"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
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
import { AxiosError } from "axios";
// import { handleActionError } from "@/lib/handleActionError";
// import { handleServerError } from "@/lib/handleServerError";
import { handleClientError } from "@/lib/handleClientError";

export function PostForm({
  initialData,
  categories,
}: {
  initialData?: Partial<PostFormData>; // ✅ Make it Partial
  categories: { id: number; name: string }[];
}) {
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

  const { watch, setValue, handleSubmit, formState } = form;

  const htmlContent = watch("content") || "";

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
