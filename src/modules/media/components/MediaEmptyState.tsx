// =============================================================================
// FILE: src/modules/media/components/MediaEmptyState.tsx
// =============================================================================
"use client";

import { ImagePlus } from "lucide-react";

interface MediaEmptyStateProps {
  hasFilters: boolean;
}

export default function MediaEmptyState({ hasFilters }: MediaEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
      <ImagePlus className="w-16 h-16 mb-4 opacity-50" />
      <p className="text-lg font-medium">No media found</p>
      <p className="text-sm mt-1">
        {hasFilters
          ? "Try adjusting your filters"
          : "Upload some files to get started"}
      </p>
    </div>
  );
}
