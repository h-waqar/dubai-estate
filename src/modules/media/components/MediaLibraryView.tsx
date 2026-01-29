// =============================================================================
// FILE: src/modules/media/components/MediaLibraryView.tsx
// =============================================================================
"use client";

import { useState } from "react";
import { Media, MediaType } from "../types/media.types";
import { useMediaStore } from "../stores/store";
import MediaToolbar from "./MediaToolbar";
import MediaGrid from "./MediaGrid";
import MediaList from "./MediaList";
import MediaEmptyState from "./MediaEmptyState";
import MediaLoadingState from "./MediaLoadingState";
import MediaErrorState from "./MediaErrorState";

interface MediaLibraryViewProps {
  selectedItems: Media[];
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
  selectionMode: "single" | "multiple";
}

export default function MediaLibraryView({
  selectedItems,
  onMediaSelect,
  mode,
  allowDelete,
  selectionMode,
}: MediaLibraryViewProps) {
  const { mediaList, loading, error } = useMediaStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<MediaType | "ALL">("ALL");

  const filteredMedia = mediaList.filter((media) => {
    const matchesSearch =
      media.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || media.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col">
      <MediaToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <MediaLoadingState />
        ) : error ? (
          <MediaErrorState error={error} />
        ) : filteredMedia.length === 0 ? (
          <MediaEmptyState
            hasFilters={searchQuery !== "" || filterType !== "ALL"}
          />
        ) : viewMode === "grid" ? (
          <MediaGrid
            media={filteredMedia}
            selectedItems={selectedItems}
            onMediaSelect={onMediaSelect}
            mode={mode}
            allowDelete={allowDelete}
            selectionMode={selectionMode}
          />
        ) : (
          <MediaList
            media={filteredMedia}
            selectedItems={selectedItems}
            onMediaSelect={onMediaSelect}
            mode={mode}
            allowDelete={allowDelete}
            selectionMode={selectionMode}
          />
        )}
      </div>
    </div>
  );
}
