// src\modules\media\components\MediaGallery.tsx
import React from "react";
import { useMedia } from "../hooks/useMedia";

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

  return (
    <div className="grid grid-cols-3 gap-2">
      {mediaList.map((media) => (
        <div
          key={media.id}
          className="relative cursor-pointer border rounded overflow-hidden"
          onClick={() => selectable && onSelect?.(media.id)}
        >
          {media.type === "IMAGE" ? (
            <img
              src={media.url}
              alt={media.alt || media.title || ""}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-700">
              {media.title || "File"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
