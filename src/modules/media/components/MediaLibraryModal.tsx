// =============================================================================
// FILE: src/modules/media/components/MediaLibraryModal.tsx
// =============================================================================
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Media } from "../types/media.types";
import { useMedia } from "../hooks/useMedia";
import MediaLibraryTabs from "./MediaLibraryTabs";
import MediaLibraryContent from "./MediaLibraryContent";
import MediaLibraryFooter from "./MediaLibraryFooter";

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: Media) => void;
  mode?: "select" | "manage";
  allowDelete?: boolean;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  mode = "select",
  allowDelete = false,
}: MediaLibraryModalProps) {
  const { fetchMedia } = useMedia();
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  if (!isOpen) return null;

  const handleSelect = (media: Media) => {
    setSelectedMedia(media);
    if (mode === "select" && onSelect) {
      onSelect(media);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Media Library
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === "select"
                ? "Select media to insert"
                : "Manage your media files"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <MediaLibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <MediaLibraryContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedMedia={selectedMedia}
          onMediaSelect={handleSelect}
          mode={mode}
          allowDelete={allowDelete}
        />

        {/* Footer */}
        <MediaLibraryFooter
          activeTab={activeTab}
          selectedMedia={selectedMedia}
          onClose={onClose}
          onInsert={() => {
            if (selectedMedia && onSelect) {
              onSelect(selectedMedia);
              onClose();
            }
          }}
          mode={mode}
        />
      </div>
    </div>
  );
}
