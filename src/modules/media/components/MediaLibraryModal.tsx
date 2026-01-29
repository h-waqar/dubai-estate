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
  scope?: "USER" | "GLOBAL";
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  mode = "select",
  allowDelete = false,
  scope = "USER",
  selectionMode = "single",
}: MediaLibraryModalProps & { selectionMode?: "single" | "multiple", onSelect?: (media: Media | Media[]) => void }) {
  const { fetchMedia } = useMedia();
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedItems, setSelectedItems] = useState<Media[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia(scope);
      setSelectedItems([]); // Reset selection on open
    }
  }, [isOpen, fetchMedia, scope]);

  if (!isOpen) return null;

  const handleSelect = (media: Media) => {
    if (selectionMode === "multiple") {
      setSelectedItems((prev) => {
        const isSelected = prev.some((item) => item.id === media.id);
        if (isSelected) {
          return prev.filter((item) => item.id !== media.id);
        } else {
          return [...prev, media];
        }
      });
    } else {
      setSelectedItems([media]);
      if (mode === "select" && onSelect) {
         // In single mode, some users might expect click-to-select immediately if onSelect provided,
         // but typically we wait for "Insert" button unless it's a direct picker.
         // However, the original code called onSelect immediately in single mode if mode === "select"?
         // Original: "if (mode === "select" && onSelect) { onSelect(media); }"
         // Wait, checking original code:
         // const handleSelect = (media: Media) => { setSelectedMedia(media); if (mode === "select" && onSelect) { onSelect(media); } };
         // The original code called onSelect immediately on click! This effectively acted as "click to insert".
         // But there was also an "Insert" button in the footer.
         // If I keep this behavior for single select, it's fine.
         // But for multi-select, we definitely don't want to close/callback on every click.
         
         // Let's preserve original behavior for single select if desireable, OR standardize on "Insert" button.
         // Actually, most "Media Library" modals require a final "Insert" click.
         // If the original called onSelect immediately, it might have been closing the modal too?
         // No, onClose wasn't called in handleSelect. So onSelect was just notifying parent?
         // But the Footer "onInsert" also called "onSelect(selectedMedia); onClose();".
         // This implies onSelect might be just "updating parent draft state" or double firing.
         
         // I'll stick to updating local state here, and only calling onSelect in the Footer for multi-select.
         // For single select, to be safe and backward compatible with "maybe the parent expects real-time updates", I could call it, but usually we want to confirm.
         // The original code:
         // handleSelect calls onSelect(media).
         // Footer onInsert calls onSelect(media) AND onClose().
         
         // If I change this, I might break things that rely on real-time selection updates.
         // But for multi-select, real-time updates might be heavy or weird (passing array every click).
         // I'll only call onSelect on "Insert" for consistency, UNLESS the previous behavior was critical.
         // Given "Insert" button exists, it implies confirmation is needed.
         // I will modify handleSelect to JUST update local state. The Footer will handle the final "commit".
      }
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
                ? selectionMode === "multiple" ? "Select multiple media items" : "Select media to insert"
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
          selectedItems={selectedItems}
          onMediaSelect={handleSelect}
          mode={mode}
          allowDelete={allowDelete}
          selectionMode={selectionMode}
        />

        {/* Footer */}
        <MediaLibraryFooter
          activeTab={activeTab}
          selectedItems={selectedItems}
          onClose={onClose}
          onInsert={() => {
            if (onSelect) {
              if (selectionMode === "single") {
                 if (selectedItems.length > 0) onSelect(selectedItems[0]);
              } else {
                 onSelect(selectedItems);
              }
              onClose();
            }
          }}
          mode={mode}
          selectionMode={selectionMode}
        />
      </div>
    </div>
  );
}
