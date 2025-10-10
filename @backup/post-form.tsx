// // src/components/posts/PostForm.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   postFormSchema,
//   type PostFormData,
//   defaultPostFormData,
// } from "@/types/post";
// import { usePostStore } from "@/stores/usePostStore";
// import { EditorContent, useEditor, type Editor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import Placeholder from "@tiptap/extension-placeholder";
// import { createLowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";
// import typescript from "highlight.js/lib/languages/typescript";
// import python from "highlight.js/lib/languages/python";
// import "highlight.js/styles/github-dark.css";

// // Register languages for code highlighting
// const lowlight = createLowlight();
// lowlight.register({ javascript, typescript, python });

// // Toolbar Component
// function EditorToolbar({ editor }: { editor: Editor | null }) {
//   if (!editor) return null;

//   const addImage = () => {
//     const url = window.prompt("Enter image URL:");
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   const setLink = () => {
//     const url = window.prompt("Enter URL:");
//     if (url) {
//       editor.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   return (
//     <div className="border-b border-border bg-muted p-2 flex flex-wrap gap-1">
//       {/* Text Formatting */}
//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleBold().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-bold transition-colors ${
//           editor.isActive("bold") ? "bg-accent" : ""
//         }`}
//         title="Bold (Ctrl+B)"
//       >
//         B
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent italic transition-colors ${
//           editor.isActive("italic") ? "bg-accent" : ""
//         }`}
//         title="Italic (Ctrl+I)"
//       >
//         I
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent line-through transition-colors ${
//           editor.isActive("strike") ? "bg-accent" : ""
//         }`}
//         title="Strikethrough"
//       >
//         S
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleCode().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-mono text-sm transition-colors ${
//           editor.isActive("code") ? "bg-accent" : ""
//         }`}
//         title="Inline Code"
//       >
//         {"</>"}
//       </button>

//       <div className="w-px bg-border mx-1" />

//       {/* Headings */}
//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-bold transition-colors ${
//           editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
//         }`}
//         title="Heading 1"
//       >
//         H1
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-bold transition-colors ${
//           editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
//         }`}
//         title="Heading 2"
//       >
//         H2
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-bold transition-colors ${
//           editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""
//         }`}
//         title="Heading 3"
//       >
//         H3
//       </button>

//       <div className="w-px bg-border mx-1" />

//       {/* Lists */}
//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors ${
//           editor.isActive("bulletList") ? "bg-accent" : ""
//         }`}
//         title="Bullet List"
//       >
//         • List
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors ${
//           editor.isActive("orderedList") ? "bg-accent" : ""
//         }`}
//         title="Numbered List"
//       >
//         1. List
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors ${
//           editor.isActive("blockquote") ? "bg-accent" : ""
//         }`}
//         title="Quote"
//       >
//         " Quote
//       </button>

//       <div className="w-px bg-border mx-1" />

//       {/* Code Block */}
//       <button
//         type="button"
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent font-mono text-sm transition-colors ${
//           editor.isActive("codeBlock") ? "bg-accent" : ""
//         }`}
//         title="Code Block"
//       >
//         {"{ }"}
//       </button>

//       <div className="w-px bg-border mx-1" />

//       {/* Link & Image */}
//       <button
//         type="button"
//         onClick={setLink}
//         className={`px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors ${
//           editor.isActive("link") ? "bg-accent" : ""
//         }`}
//         title="Add Link"
//       >
//         🔗 Link
//       </button>

//       <button
//         type="button"
//         onClick={addImage}
//         className="px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors"
//         title="Add Image"
//       >
//         🖼️ Image
//       </button>

//       <div className="w-px bg-border mx-1" />

//       {/* Undo/Redo */}
//       <button
//         type="button"
//         onClick={() => editor.chain().focus().undo().run()}
//         disabled={!editor.can().undo()}
//         className="px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
//         title="Undo (Ctrl+Z)"
//       >
//         ↶
//       </button>

//       <button
//         type="button"
//         onClick={() => editor.chain().focus().redo().run()}
//         disabled={!editor.can().redo()}
//         className="px-3 py-1.5 rounded text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
//         title="Redo (Ctrl+Shift+Z)"
//       >
//         ↷
//       </button>
//     </div>
//   );
// }

// export function PostForm() {
//   const {
//     post,
//     setPost,
//     setLoading,
//     setError,
//     setSuccess,
//     autoSaveEnabled,
//     saving,
//     startSaving,
//     stopSaving,
//     markSaved,
//   } = usePostStore();

//   const [isPreview, setIsPreview] = useState(false);

//   // Merge defaults with Zustand store
//   const formDefaultValues: PostFormData = {
//     ...defaultPostFormData,
//     ...post,
//   };

//   const form = useForm<PostFormData>({
//     resolver: zodResolver(postFormSchema),
//     defaultValues: formDefaultValues,
//   });

//   // --- TipTap Editor ---
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: {
//           levels: [1, 2, 3],
//         },
//       }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           class: "text-blue-600 underline hover:text-blue-800",
//         },
//       }),
//       Image.configure({
//         HTMLAttributes: {
//           class: "max-w-full h-auto rounded-lg my-4",
//         },
//       }),
//       CodeBlockLowlight.configure({
//         lowlight,
//         HTMLAttributes: {
//           class:
//             "rounded-lg bg-gray-900 text-gray-100 p-4 my-4 overflow-x-auto",
//         },
//       }),
//       Placeholder.configure({
//         placeholder:
//           "Start writing your blog post... Type '/' for commands, or use the toolbar above.",
//       }),
//     ],
//     content: formDefaultValues.content || "",
//     onUpdate({ editor }) {
//       const html = editor.getHTML();
//       form.setValue("content", html, { shouldValidate: true });
//     },
//     immediatelyRender: false,
//     editorProps: {
//       attributes: {
//         class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
//       },
//     },
//   });

//   // Sync form -> Zustand store
//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       const safeValues = {
//         ...values,
//         tags: values.tags?.filter((t): t is string => !!t) ?? [],
//       };
//       setPost(safeValues);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, setPost]);

//   // Auto-save effect
//   useEffect(() => {
//     if (!autoSaveEnabled) return;

//     const timeout = setTimeout(() => {
//       startSaving();
//       setTimeout(() => {
//         markSaved();
//         stopSaving();
//         setSuccess(`Auto-saved at ${new Date().toLocaleTimeString()}`);
//       }, 1000);
//     }, 3000);

//     return () => clearTimeout(timeout);
//   }, [post, autoSaveEnabled, startSaving, stopSaving, markSaved, setSuccess]);

//   const onSubmit: SubmitHandler<PostFormData> = async (data) => {
//     const normalized = {
//       ...data,
//       categoryId: data.categoryId || null,
//       coverImage: data.coverImage || "https://picsum.photos/200/300",
//       excerpt: data.excerpt || "",
//     };

//     try {
//       setLoading(true);
//       setError(null);

//       // ✅ Call your Next.js API route
//       const res = await fetch("/api/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(normalized),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to save post");
//       }

//       const savedPost = await res.json();
//       setSuccess("Post saved successfully!");
//       markSaved();
//       console.log("✅ Saved Post:", savedPost);
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : "Something went wrong";
//       setError(message);
//       console.error("❌ Save Post Error:", message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const htmlContent = form.watch("content") || "";

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//       {/* Header with Preview Toggle */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">
//           {isPreview ? "Preview" : "Write Blog Post"}
//         </h2>
//         <button
//           type="button"
//           onClick={() => setIsPreview(!isPreview)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//         >
//           {isPreview ? "✏️ Edit" : "👁️ Preview"}
//         </button>
//       </div>

//       {!isPreview ? (
//         <>
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Title</label>
//             <input
//               {...form.register("title")}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
//               placeholder="Enter your blog title..."
//             />
//             {form.formState.errors.title && (
//               <p className="text-red-500 text-sm mt-1">
//                 {form.formState.errors.title.message}
//               </p>
//             )}
//           </div>

//           {/* Slug */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Slug</label>
//             <input
//               {...form.register("slug")}
//               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
//               placeholder="blog-post-url-slug"
//             />
//             {form.formState.errors.slug && (
//               <p className="text-red-500 text-sm mt-1">
//                 {form.formState.errors.slug.message}
//               </p>
//             )}
//           </div>

//           {/* TipTap Editor with Toolbar */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Content</label>
//             <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
//               <EditorToolbar editor={editor} />
//               <EditorContent editor={editor} />
//             </div>
//             {form.formState.errors.content && (
//               <p className="text-red-500 text-sm mt-1">
//                 {form.formState.errors.content.message}
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               💡 Tip: Use markdown shortcuts like # for headings, - for lists,
//               ``` for code blocks
//             </p>
//           </div>

//           {/* Published Checkbox */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="checkbox"
//               {...form.register("published")}
//               className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-sm font-medium">Publish immediately</span>
//           </div>

//           {/* Submit Button */}
//           <div className="flex items-center gap-4">
//             <button
//               type="submit"
//               disabled={saving || form.formState.isSubmitting}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
//             >
//               {saving || form.formState.isSubmitting
//                 ? "Saving..."
//                 : "Save Post"}
//             </button>

//             {/* Status Indicators */}
//             {saving && (
//               <span className="text-sm text-gray-600 flex items-center gap-2">
//                 <span className="animate-spin">⏳</span> Auto-saving...
//               </span>
//             )}
//             {post.lastSavedAt && !saving && (
//               <span className="text-sm text-green-600">
//                 ✓ Saved at {new Date(post.lastSavedAt).toLocaleTimeString()}
//               </span>
//             )}
//           </div>

//           {/* Stats */}
//           <div className="flex gap-6 text-sm text-gray-500">
//             <span>
//               Words:{" "}
//               {
//                 htmlContent
//                   .replace(/<[^>]*>/g, "")
//                   .split(/\s+/)
//                   .filter(Boolean).length
//               }
//             </span>
//             <span>
//               Characters: {htmlContent.replace(/<[^>]*>/g, "").length}
//             </span>
//           </div>
//         </>
//       ) : (
//         /* Preview Mode */
//         <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
//           {/* Preview Header */}
//           <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
//             <h1 className="text-4xl font-bold mb-2">
//               {form.watch("title") || "Untitled Post"}
//             </h1>
//             <p className="text-sm text-gray-500 font-mono">
//               /{form.watch("slug") || "no-slug"}
//             </p>
//           </div>

//           {/* Preview Content */}
//           <article className="px-8 py-8">
//             {htmlContent && htmlContent !== "<p></p>" ? (
//               <div
//                 className="prose prose-lg prose-blue max-w-none"
//                 dangerouslySetInnerHTML={{ __html: htmlContent }}
//               />
//             ) : (
//               <p className="text-gray-400 italic text-center py-12">
//                 No content yet. Start writing to see the preview!
//               </p>
//             )}
//           </article>

//           {/* Preview Footer */}
//           <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 text-sm text-gray-600 flex justify-between items-center">
//             <span>
//               Status:{" "}
//               <span
//                 className={
//                   form.watch("published")
//                     ? "text-green-600 font-medium"
//                     : "text-yellow-600 font-medium"
//                 }
//               >
//                 {form.watch("published") ? "✓ Published" : "📝 Draft"}
//               </span>
//             </span>
//             <span className="text-gray-400">
//               Last updated: {new Date().toLocaleDateString()}
//             </span>
//           </div>
//         </div>
//       )}
//     </form>
//   );
// }
