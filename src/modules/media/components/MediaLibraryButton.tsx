// =============================================================================
// FILE: src/modules/media/components/MediaLibraryButton.tsx
// =============================================================================
"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Media } from "../types/media.types";
import MediaLibraryModal from "./MediaLibraryModal";

interface MediaLibraryButtonProps {
  onSelect: (media: Media) => void;
  buttonText?: string;
  buttonClassName?: string;
  mode?: "select" | "manage";
  allowDelete?: boolean;
}

export default function MediaLibraryButton({
  onSelect,
  buttonText = "Select Media",
  buttonClassName,
  mode = "select",
  allowDelete = false,
}: MediaLibraryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ||
          "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
        }
      >
        <ImagePlus className="w-5 h-5" />
        {buttonText}
      </button>

      <MediaLibraryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(media) => {
          onSelect(media);
          setIsOpen(false);
        }}
        mode={mode}
        allowDelete={allowDelete}
      />
    </>
  );
}
