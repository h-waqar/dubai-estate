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
  selectedMedia: Media | null;
  onMediaSelect: (media: Media) => void;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaLibraryContent({
  activeTab,
  onTabChange,
  selectedMedia,
  onMediaSelect,
  mode,
  allowDelete,
}: MediaLibraryContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      {activeTab === "library" ? (
        <MediaLibraryView
          selectedMedia={selectedMedia}
          onMediaSelect={onMediaSelect}
          mode={mode}
          allowDelete={allowDelete}
        />
      ) : (
        <MediaUploadView onUploadSuccess={() => onTabChange("library")} />
      )}
    </div>
  );
}
