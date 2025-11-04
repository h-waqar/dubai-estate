// src/modules/media/components/MediaGallery.tsx
import React from "react";
import { useMedia } from "../hooks/useMedia";
import { Media } from "../types/media.types";

interface MediaGalleryProps {
  selectable?: boolean;
  onSelect?: (id: number) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  selectable = false,
  onSelect,
}) => {
  const { mediaList, loading, error, fetchMedia } = useMedia();

  React.useEffect(() => {
    fetchMedia();
  }, []);

  if (loading) return <p>Loading media...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const renderMedia = (media: Media) => {
    switch (media.type) {
      case "IMAGE":
        return (
          <img
            src={media.url}
            alt={media.alt || media.title || "image"}
            className="w-full h-32 object-cover rounded"
          />
        );
      case "VIDEO":
        return (
          <video
            src={media.url}
            className="w-full h-32 object-cover rounded"
            autoPlay
            muted
            loop
            controls
          />
        );
      default:
        return (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-700 rounded p-2 text-sm text-center">
            {media.title || "File"}
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {mediaList.map((media) => (
        <div
          key={media.id}
          className={`relative cursor-pointer border rounded overflow-hidden hover:shadow-lg transition-shadow duration-200`}
          onClick={() => selectable && onSelect?.(media.id)}
        >
          {renderMedia(media)}
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
