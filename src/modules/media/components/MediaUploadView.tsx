"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle, CheckCircle2, File as FileIcon, Loader2, Trash2 } from "lucide-react";
import { MediaType, Media } from "../types/media.types";
import { useMediaStore } from "../stores/store";
import { formatFileSize } from "../utils/formatFileSize";
import { uploadMedia } from "../actions/uploadMedia";
import { handleClientError } from "@/lib/handleClientError";

interface MediaUploadViewProps {
  onUploadSuccess: () => void;
}

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "PENDING" | "UPLOADING" | "SUCCESS" | "ERROR";
  error?: string;
  title: string;
  alt: string;
  type: MediaType | "AUTO";
  videoDuration?: number;
}

const MAX_FILES = 10;
const CONCURRENCY_LIMIT = 3;

export default function MediaUploadView({
  onUploadSuccess,
}: MediaUploadViewProps) {
  const { addMedia } = useMediaStore();
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup object URLs on unmount
      queue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith("image/")) return "IMAGE";
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type === "application/pdf") return "DOCUMENT";
    return "OTHER";
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "video/mp4",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type";
    }
    if (file.size > 75 * 1024 * 1024) {
      return "File too large (>75MB)";
    }
    return null;
  };

  const onFilesSelected = async (files: FileList | null) => {
    if (!files) return;

    setGlobalError(null);
    const newItems: UploadItem[] = [];
    const filesArray = Array.from(files);

    if (queue.length + filesArray.length > MAX_FILES) {
      setGlobalError(`You can only upload up to ${MAX_FILES} files at a time.`);
      return;
    }

    for (const file of filesArray) {
      const error = validateFile(file);
      const objectUrl = URL.createObjectURL(file);
      
      let videoDuration: number | undefined;
      if (file.type.startsWith("video/")) {
         try {
            videoDuration = await new Promise((resolve) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => resolve(video.duration);
                video.onerror = () => resolve(0);
                video.src = objectUrl;
            });
         } catch (e) {
            console.warn("Failed to get video duration", e);
         }
      }

      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: objectUrl,
        status: error ? "ERROR" : "PENDING",
        error: error || (videoDuration && videoDuration > 90 ? "Video exceeds 90s" : undefined),
        title: file.name.replace(/\.[^/.]+$/, ""),
        alt: "",
        type: "AUTO",
        videoDuration,
      });
    }

    setQueue((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const processUpload = async (item: UploadItem) => {
    updateItem(item.id, { status: "UPLOADING" });

    try {
      const type = item.type === "AUTO" ? getMediaType(item.file) : item.type;
      
      const newMedia = await uploadMedia({
        file: item.file,
        title: item.title,
        alt: item.alt || item.title,
        type,
      });

      addMedia(newMedia);
      updateItem(item.id, { status: "SUCCESS" });
    } catch (err: unknown) {
      const error = handleClientError(err);
      updateItem(item.id, { status: "ERROR", error: error.message });
    }
  };

  const startUpload = async () => {
    setIsUploading(true);
    const pendingItems = queue.filter((i) => i.status === "PENDING" && !i.error);
    
    // Simple concurrency control
    const executing: Promise<void>[] = [];
    
    for (const item of pendingItems) {
        const p = processUpload(item).then(() => {
            executing.splice(executing.indexOf(p), 1);
        });
        executing.push(p);
        
        if (executing.length >= CONCURRENCY_LIMIT) {
            await Promise.race(executing);
        }
    }
    
    await Promise.all(executing);
    setIsUploading(false);
    
    // Check if all succeeded to notify parent?
    // Requirement says: "Newly uploaded media appears immediately... No forced tab switching".
    // So we assume user stays here until they decide to switch or clear.
    // If all success, maybe we can clear completed? 
    // Requirement: "After a batch upload completes... Newly uploaded items MUST immediately appear in the Library view... No forced tab switching required".
    // So we just leave them as SUCCESS in the list.
  };

  const hasPending = queue.some((i) => i.status === "PENDING" && !i.error);
  const allSuccess = queue.length > 0 && queue.every((i) => i.status === "SUCCESS");

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Upload Drop Zone */}
        {queue.length < MAX_FILES && !isUploading && (
          <div>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => onFilesSelected(e.target.files)}
                accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,application/pdf"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800/50"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Click to upload or drag and drop
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Up to {MAX_FILES} files. Max 75MB.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {globalError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {globalError}
            </p>
          </div>
        )}

        {/* File Queue */}
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 p-4 rounded-lg border ${
                item.status === "ERROR"
                  ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900"
                  : item.status === "SUCCESS"
                  ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900"
                  : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
              }`}
            >
              {/* Preview */}
              <div className="w-20 h-20 shrink-0 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                {item.file.type.startsWith("image/") ? (
                  <Image
                    src={item.previewUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : item.file.type.startsWith("video/") ? (
                  <video src={item.previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {item.status === "UPLOADING" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}
                {item.status === "SUCCESS" && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                )}
              </div>

              {/* Inputs */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                            {item.file.name}
                        </p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(item.file.size)}
                         </p>
                    </div>
                     {!isUploading && item.status !== "SUCCESS" && (
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {item.status !== "SUCCESS" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        disabled={isUploading}
                        placeholder="Title"
                        className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        value={item.alt}
                        onChange={(e) => updateItem(item.id, { alt: e.target.value })}
                        disabled={isUploading}
                        placeholder="Alt text (optional)"
                        className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                    </div>
                )}
                
                {item.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {item.error}
                    </p>
                )}
                
                {item.status === "SUCCESS" && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        Upload Complete
                    </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div>
            {queue.length > 0 && (
                <button 
                    onClick={() => setQueue([])}
                    disabled={isUploading}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                </button>
            )}
        </div>
        <div className="flex gap-3">
            <button
                onClick={onUploadSuccess}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
                Back to Library
            </button>
            <button
                onClick={startUpload}
                disabled={!hasPending || isUploading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        {allSuccess && queue.length > 0 ? "Uploaded" : `Upload ${queue.filter(i => i.status === 'PENDING' && !i.error).length} Files`}
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}
