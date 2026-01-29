// =============================================================================
// FILE: src/modules/media/components/MediaList.tsx
// =============================================================================
"use client";

import { Media } from "../types/media.types";
import MediaListItem from "./MediaListItem";

interface MediaListProps {
  media: Media[];
  selectedItems: Media[];
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
  selectionMode: "single" | "multiple";
}

export default function MediaList({
  media,
  selectedItems,
  onMediaSelect,
  mode,
  allowDelete,
}: MediaListProps) {
  return (
    <div className="flex flex-col gap-2">
      {media.map((item) => (
        <MediaListItem
          key={item.id}
          media={item}
          isSelected={selectedItems.some((i) => i.id === item.id)}
          onSelect={onMediaSelect}
          mode={mode}
          allowDelete={allowDelete}
        />
      ))}
    </div>
  );
}
