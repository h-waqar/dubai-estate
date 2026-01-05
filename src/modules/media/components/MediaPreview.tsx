"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Trash2, Play, FileText, Loader2, Video as VideoIcon } from "lucide-react";
import { Media } from "../types/media.types";
import { useMedia } from "../hooks/useMedia";
import { getMediaIcon } from "../utils/getMediaIcon";

interface MediaPreviewProps {
  media: Media;
  isSelected: boolean;
  mode: "select" | "manage";
  allowDelete: boolean;
}

export default function MediaPreview({
  media,
  isSelected,
  mode,
  allowDelete,
}: MediaPreviewProps) {
  const { handleDelete } = useMedia();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await handleDelete(media.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Construct thumbnail URL for video (replace extension with .jpg)
  const videoThumbnail = media.type === "VIDEO" 
    ? media.url.replace(/\.[^/.]+$/, ".jpg")
    : null;

  const baseClasses = `relative rounded-lg overflow-hidden transition-all duration-200 ${isSelected
    ? "ring-2 ring-blue-500"
    : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
    }`;

  return (
    <div className={baseClasses}>
      <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
        {media.type === "IMAGE" && (
          <Image
            src={media.url}
            alt={media.alt || media.title || "Media image"}
            fill
            className="object-cover"
          />
        )}
        {media.type === "VIDEO" && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 group relative">
            {!isVideoError ? (
              <video
                src={media.url}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => setIsVideoLoaded(true)}
                onError={() => setIsVideoError(true)}
                poster={videoThumbnail || undefined}
              />
            ) : (
               /* Processing State / Fallback */
               <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-900/50">
                  {videoThumbnail ? (
                     // If we have a thumbnail, show it with a processing overlay
                     <>
                       <Image 
                         src={videoThumbnail} 
                         alt="Video processing" 
                         fill 
                         className="object-cover opacity-50"
                         onError={() => { /* If thumb fails, just show icon */ }}
                       />
                       <div className="z-10 flex flex-col items-center">
                         <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                         <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">Processing...</span>
                       </div>
                     </>
                  ) : (
                     // No thumbnail yet (very early processing)
                     <div className="flex flex-col items-center">
                       <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                       <span className="text-xs text-gray-400">Processing Video...</span>
                     </div>
                  )}
               </div>
            )}
            
            {/* Play Button Overlay (only when loaded) */}
            {isVideoLoaded && !isVideoError && (
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center pointer-events-none">
                <Play className="w-12 h-12 text-white/90" />
              </div>
            )}
          </div>
        )}
        {(media.type === "DOCUMENT" || media.type === "OTHER") && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-center">
              {/* Reuse getMediaIcon or direct icon */}
              <FileText className="w-12 h-12 text-gray-400 mb-2 mx-auto" />
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 px-2 truncate">
                {media.title || "File"}
              </p>
              <span className="text-[10px] uppercase text-gray-400">
                {media.mimeType?.split("/")[1] || "FILE"}
              </span>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg z-20">
          <Check className="w-4 h-4" />
        </div>
      )}

      {mode === "manage" && allowDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
