// src\components\posts\TwoColumnView.tsx
"use client";
import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";

import { type Node as ProseMirrorNode } from "@tiptap/pm/model";

interface TwoColumnViewProps {
  node: ProseMirrorNode;
}

export const TwoColumnView = ({ node }: TwoColumnViewProps) => {
  // const columnCount = node.content?.length || 2;
  const columnCount = node.content?.childCount || 2;
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
