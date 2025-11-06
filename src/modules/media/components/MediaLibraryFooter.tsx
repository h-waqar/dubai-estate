// =============================================================================
// FILE: src/modules/media/components/MediaLibraryFooter.tsx
// =============================================================================
"use client";

import { Check } from "lucide-react";
import { Media } from "../types/media.types";
import { useMediaStore } from "../stores/store";

interface MediaLibraryFooterProps {
  activeTab: "library" | "upload";
  selectedMedia: Media | null;
  onClose: () => void;
  onInsert: () => void;
  mode: "select" | "manage";
}

export default function MediaLibraryFooter({
  activeTab,
  selectedMedia,
  onClose,
  onInsert,
  mode,
}: MediaLibraryFooterProps) {
  const { mediaList } = useMediaStore();

  return (
    <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {activeTab === "library" && selectedMedia && (
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Selected: {selectedMedia.title}
          </span>
        )}
        {activeTab === "library" && !selectedMedia && (
          <span>{mediaList.length} items</span>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        {activeTab === "library" && mode === "select" && (
          <button
            onClick={onInsert}
            disabled={!selectedMedia}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Insert Media
          </button>
        )}
      </div>
    </div>
  );
}
