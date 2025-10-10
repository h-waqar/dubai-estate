// src\components\posts\Editor.tsx
"use client";

import React from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github-dark.css";

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// --- Setup syntax highlighting ---
const lowlight = createLowlight();
lowlight.register({ javascript, typescript, python });

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "rounded-lg bg-gray-900 text-gray-100 p-4 my-4 overflow-x-auto",
        },
      }),
      Placeholder.configure({
        placeholder:
          "Start writing your blog post... Type '/' for commands, or use the toolbar above.",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// --- Toolbar component ---
function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("Enter link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border-b border-border bg-muted p-2 flex flex-wrap gap-1">
      {/* --- Basic text styles --- */}
      <ToolbarButton
        label="B"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      />
      <ToolbarButton
        label="I"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
        italic
      />
      <ToolbarButton
        label="S"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
        strike
      />
      <ToolbarButton
        label="</>"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline Code"
        mono
      />

      <Separator />

      {/* --- Headings --- */}
      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          label={`H${level}`}
          active={editor.isActive("heading", { level })}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          title={`Heading ${level}`}
        />
      ))}

      <Separator />

      {/* --- Lists --- */}
      <ToolbarButton
        label="• List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1. List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="❝ Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <Separator />

      {/* --- Code block --- */}
      <ToolbarButton
        label="{ }"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <Separator />

      {/* --- Link & Image --- */}
      <ToolbarButton
        label="🔗 Link"
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolbarButton label="🖼️ Image" onClick={addImage} />

      <Separator />

      {/* --- Undo/Redo --- */}
      <ToolbarButton
        label="↶"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <ToolbarButton
        label="↷"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  active,
  title,
  disabled,
  italic,
  strike,
  mono,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  italic?: boolean;
  strike?: boolean;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 rounded transition-colors text-foreground hover:bg-accent ${
        active ? "bg-accent" : ""
      } ${italic ? "italic" : ""} ${strike ? "line-through" : ""} ${
        mono ? "font-mono text-sm" : ""
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

function Separator() {
  return <div className="w-px bg-border mx-1" />;
}
