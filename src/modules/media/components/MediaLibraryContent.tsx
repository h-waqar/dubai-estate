// =============================================================================
// FILE: src/modules/media/components/MediaLibraryContent.tsx
// =============================================================================
"use client";

import { Media } from "../types/media.types";
import MediaLibraryView from "./MediaLibraryView";
import MediaUploadView from "./MediaUploadView";

interface MediaLibraryContentProps {
  activeTab: "library" | "upload";
  onTabChange: (tab: "library" | "upload") => void;
  selectedItems: Media[];
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
  selectionMode: "single" | "multiple";
}

export default function MediaLibraryContent({
  activeTab,
  onTabChange,
  selectedItems,
  onMediaSelect,
  mode,
  allowDelete,
  selectionMode,
}: MediaLibraryContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      {activeTab === "library" ? (
        <MediaLibraryView
          selectedItems={selectedItems}
          onMediaSelect={onMediaSelect}
          mode={mode}
          allowDelete={allowDelete}
          selectionMode={selectionMode}
        />
      ) : (
        <MediaUploadView onUploadSuccess={() => onTabChange("library")} />
      )}
    </div>
  );
}
