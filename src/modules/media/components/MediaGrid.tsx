// =============================================================================
// FILE: src/modules/media/components/MediaGrid.tsx
// =============================================================================
"use client";

import { Media } from "../types/media.types";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  media: Media[];
  selectedMedia: Media | null;
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaGrid({
  media,
  selectedMedia,
  onMediaSelect,
  mode,
  allowDelete,
}: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          isSelected={selectedMedia?.id === item.id}
          onSelect={onMediaSelect}
          mode={mode}
          allowDelete={allowDelete}
        />
      ))}
    </div>
  );
}
