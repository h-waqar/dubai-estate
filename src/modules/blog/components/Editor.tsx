"use client";

import React from "react";
import {
  EditorContent,
  useEditor,
  type Editor,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github-dark.css";
import { Node, mergeAttributes } from "@tiptap/core";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// --- Syntax Highlighting ---
const lowlight = createLowlight();
lowlight.register({ javascript, typescript, python });

// --- TwoColumn NodeView ---
import { type Node as ProseMirrorNode } from "@tiptap/pm/model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TwoColumnView = ({ node }: { node: ProseMirrorNode }) => {
  const columnCount = node.content?.length || 2;
  return (
    <NodeViewWrapper className="flex gap-4 my-4 border-2 border-dashed border-blue-400 p-2">
      {Array.from({ length: columnCount }).map((_, index) => (
        <ResizableBox
          key={index}
          width={300}
          height={Infinity}
          axis="x"
          minConstraints={[100, Infinity]}
          maxConstraints={[600, Infinity]}
          handle={<span className="resizable-handle" />}
          className="overflow-hidden"
        >
          <div className="flex-1 p-2">
            <NodeViewContent as="div" />
          </div>
        </ResizableBox>
      ))}
    </NodeViewWrapper>
  );
};

// --- TwoColumn node (Grid Layout)
const TwoColumn = Node.create({
  name: "twoColumn",
  group: "block",
  content: "block+ block+",
  parseHTML() {
    return [{ tag: "div[data-type='two-column']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "two-column",
        class: "grid grid-cols-1 md:grid-cols-2 gap-4 my-4",
      }),
      0,
    ];
  },
  addNodeView() {
    return ({ node }) => <TwoColumnView node={node} />;
  },
});

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          className: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            align: { default: "center" },
            width: { default: "100%" },
          };
        },
      }).configure({ HTMLAttributes: { class: "rounded-lg my-4" } }),
      ImageResize.configure({
        handleClasses: { corner: "bg-blue-500 w-3 h-3 rounded-full" },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "rounded-lg bg-gray-900 text-gray-100 p-4 my-4 overflow-x-auto",
        },
      }),
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TwoColumn,
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
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

// --- Toolbar ---
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

  const insertTwoColumn = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "twoColumn",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Left content" }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "Right content" }],
          },
        ],
      })
      .run();
  };

  return (
    <div className="border-b border-border bg-muted p-2 flex flex-wrap gap-1">
      {/* Text Styles */}
      <ToolbarButton
        label="B"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      />
      <ToolbarButton
        label="I"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        italic
      />
      <ToolbarButton
        label="S"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        strike
      />
      <ToolbarButton
        label="</>"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        mono
      />

      <Separator />

      {/* Alignment */}
      {["left", "center", "right", "justify"].map((align) => (
        <ToolbarButton
          key={align}
          label={align.charAt(0).toUpperCase()}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
          active={editor.isActive({ textAlign: align })}
          title={`Align ${align}`}
        />
      ))}

      <Separator />

      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          label={`H${level}`}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
        />
      ))}

      <Separator />

      {/* Lists */}
      <ToolbarButton
        label="• List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      />
      <ToolbarButton
        label="1. List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      />
      <ToolbarButton
        label="❝ Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      />

      <Separator />

      {/* Code Block */}
      <ToolbarButton
        label="{ }"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
      />

      <Separator />

      {/* Grid Layout */}
      <ToolbarButton label="Grid 2" onClick={insertTwoColumn} />

      <Separator />

      {/* Link & Image */}
      <ToolbarButton
        label="🔗 Link"
        onClick={setLink}
        active={editor.isActive("link")}
      />
      <ToolbarButton label="🖼️ Image" onClick={addImage} />

      <Separator />

      {/* Undo/Redo */}
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

// --- Toolbar Button ---
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
