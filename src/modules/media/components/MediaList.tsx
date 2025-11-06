// =============================================================================
// FILE: src/modules/media/components/MediaList.tsx
// =============================================================================
"use client";

import { Media } from "../types/media.types";
import MediaListItem from "./MediaListItem";

interface MediaListProps {
  media: Media[];
  selectedMedia: Media | null;
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaList({
  media,
  selectedMedia,
  onMediaSelect,
  mode,
  allowDelete,
}: MediaListProps) {
  return (
    <div className="space-y-2">
      {media.map((item) => (
        <MediaListItem
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
