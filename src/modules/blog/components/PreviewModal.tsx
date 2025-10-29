// src/components/posts/PreviewModal.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  content: string;
}

export function PreviewModal({
  isOpen,
  onClose,
  title,
  slug,
  content,
}: PreviewModalProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          w-full
          h-full
          md:rounded-none
          md:p-4
          overflow-auto
          bg-background dark:bg-background
          text-foreground dark:text-foreground
          ${
            isFullScreen
              ? "md:w-full md:h-full"
              : "md:max-w-5xl md:h-[90vh] md:rounded-lg"
          }
        `}
      >
        {/* --- Header with toggle --- */}
        <div className="flex justify-between items-start mb-6 md:mb-8 sticky top-0 bg-background dark:bg-background z-10 py-4">
          <div>
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              {title || "Untitled Post"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              /{slug || "no-slug"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isFullScreen ? "Mobile Preview" : "PC Preview"}
            </button>

            <DialogClose className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Close
            </DialogClose>
          </div>
        </div>

        {/* --- Content --- */}
        <article className="prose prose-lg md:prose-xl max-w-none dark:prose-invert">
          {content && content !== "<p></p>" ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-muted-foreground italic text-center py-12">
              No content yet. Start writing to see the preview!
            </p>
          )}
        </article>
      </DialogContent>
    </Dialog>
  );
}
