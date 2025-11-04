"use client";
import React from "react";
import MediaUploader from "@/modules/media/components/MediaUploader";

function MediaUploaderPage() {
  return (
    <div>
      <MediaUploader userId={1} />
    </div>
  );
}

export default MediaUploader;
