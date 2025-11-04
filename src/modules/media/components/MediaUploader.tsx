// src/modules/media/components/MediaUploader.tsx
"use client";

import { useState } from "react";
import { uploadMediaAction } from "../actions/uploadMedia";

export default function MediaUploader({ userId }: { userId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", file.type.startsWith("video/") ? "VIDEO" : "IMAGE");
    const media = await uploadMediaAction(formData, userId);
    console.log("Uploaded media:", media);
    setFile(null);
    setPreview("");
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      {preview && (
        <img src={preview} alt="preview" className="w-32 h-32 object-cover" />
      )}
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
}
