// src/modules/media/components/MediaUploader.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMedia } from "../hooks/useMedia";
import { MediaType } from "../types/media.types";

const MEDIA_TYPES: MediaType[] = ["IMAGE", "VIDEO", "DOCUMENT", "OTHER"];

const MediaUploader: React.FC = () => {
  const { handleUpload, loading, error } = useMedia();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const [type, setType] = useState<MediaType | "AUTO">("AUTO");

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith("image/")) return "IMAGE";
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type === "application/pdf") return "DOCUMENT";
    return "OTHER";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));

    // Auto-set type if AUTO selected
    if (type === "AUTO") setType(getMediaType(selected));
  };

  const onUpload = async () => {
    if (!file) return;

    try {
      await handleUpload({
        file,
        title: title || file.name,
        alt: alt || file.name,
        type: type === "AUTO" ? getMediaType(file) : type,
      });

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setAlt("");
      setType("AUTO");
    } catch (err) {
      console.error(err);
    }
  };

  const renderPreview = () => {
    if (!file || !previewUrl) return null;

    if (type === "VIDEO" || file.type.startsWith("video/")) {
      return (
        <video
          src={previewUrl}
          autoPlay
          muted
          loop
          controls
          className="w-full max-h-64 object-contain rounded"
        />
      );
    } else if (type === "IMAGE" || file.type.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt={alt || title || "preview"}
          className="w-full max-h-64 object-cover rounded"
        />
      );
    } else {
      return (
        <div className="w-full max-h-64 flex items-center justify-center bg-gray-100 text-gray-700 rounded">
          {file.name}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
      {/* File Input */}
      <input type="file" onChange={onFileChange} />

      {/* File Preview */}
      {renderPreview()}

      {/* Metadata Form */}
      {file && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Alt Text</label>
            <input
              type="text"
              value={alt}
              maxLength={150}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MediaType | "AUTO")}
              className="w-full px-2 py-1 border rounded hidden"
              disabled
            >
              <option value="AUTO">Auto Detect</option>
              {MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Mime & Size Display */}
          <div className="text-sm text-gray-500">
            MIME: {file.type} | Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MediaUploader;
