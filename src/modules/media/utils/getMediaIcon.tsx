// =============================================================================
// FILE: src/modules/media/utils/getMediaIcon.tsx
// =============================================================================
import React from "react";
import { Image, Video, File } from "lucide-react";
import { MediaType } from "../types/media.types";

export function getMediaIcon(type: MediaType) {
  switch (type) {
    case "IMAGE":
      return <Image className="w-4 h-4" />;
    case "VIDEO":
      return <Video className="w-4 h-4" />;
    case "DOCUMENT":
      return <File className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}
