// src/modules/media/components/MediaGallery.tsx
"use client";

import { useEffect, useState } from "react";
import { listMediaAction } from "../actions/listMedia";

export default function MediaGallery() {
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    listMediaAction().then(setMedia);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* {media.map((m) => (
        <img
          key={m.id}
          src={m.url}
          alt={m.alt ?? m.title}
          className="w-full h-32 object-cover"
        />
      ))} */}
      {media.map((m) => (
        <div key={m.id}>
          {m.type === "VIDEO" ? (
            <video
              src={m.url}
              className="w-full h-32 object-cover"
              controls
              muted
            />
          ) : (
            <img
              src={m.url}
              alt={m.alt ?? m.title}
              className="w-full h-32 object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
