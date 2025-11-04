// src\modules\media\components\MediaUploader.tsx
import React, { useState } from "react";
import { useMedia } from "../hooks/useMedia";

const MediaUploader: React.FC = () => {
  const { handleUpload, loading, error } = useMedia();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getMediaType = (
    file: File
  ): "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER" => {
    if (file.type.startsWith("image/")) return "IMAGE";
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type === "application/pdf") return "DOCUMENT";
    return "OTHER";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!selectedFile) return;
    try {
      // await handleUpload(selectedFile);
      await handleUpload({
        file: selectedFile,
        title: selectedFile.name,
        alt: selectedFile.name,
        type: getMediaType(selectedFile),
      });
      setSelectedFile(null);
    } catch {}
  };

  return (
    <div className="space-y-2">
      <input type="file" onChange={onFileChange} />
      {selectedFile && <p>Selected: {selectedFile.name}</p>}
      <button
        onClick={onUpload}
        disabled={!selectedFile || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Upload
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
export default MediaUploader;
