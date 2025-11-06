// =============================================================================
// FILE: src/modules/media/components/MediaCard.tsx
// =============================================================================
"use client";

import { Media } from "../types/media.types";
import MediaPreview from "./MediaPreview";
import { formatFileSize } from "../utils/formatFileSize";

interface MediaCardProps {
  media: Media;
  isSelected: boolean;
  onSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaCard({
  media,
  isSelected,
  onSelect,
  mode,
  allowDelete,
}: MediaCardProps) {
  return (
    <div onClick={() => onSelect(media)} className="cursor-pointer group">
      <MediaPreview
        media={media}
        isSelected={isSelected}
        mode={mode}
        allowDelete={allowDelete}
      />
      <div className="mt-2">
        <p
          className="text-sm font-medium text-gray-900 dark:text-white truncate"
          title={media.title || "Untitled"}
        >
          {media.title || "Untitled"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(media.size)}
        </p>
      </div>
    </div>
  );
}
