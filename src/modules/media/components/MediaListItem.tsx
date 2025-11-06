// =============================================================================
// FILE: src/modules/media/components/MediaListItem.tsx
// =============================================================================
"use client";
import { Media } from "../types/media.types";
import MediaPreview from "./MediaPreview";
import { getMediaIcon } from "../utils/getMediaIcon";
import { formatFileSize } from "../utils/formatFileSize";

interface MediaListItemProps {
  media: Media;
  isSelected: boolean;
  onSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaListItem({
  media,
  isSelected,
  onSelect,
  mode,
  allowDelete,
}: MediaListItemProps) {
  return (
    <div
      onClick={() => onSelect(media)}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <div className="w-16 h-16 shrink-0">
        <MediaPreview
          media={media}
          isSelected={isSelected}
          mode={mode}
          allowDelete={allowDelete}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {media.title || "Untitled"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {media.mimeType} • {formatFileSize(media.size)}
        </p>
      </div>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        {getMediaIcon(media.type)}
      </div>
    </div>
  );
}
