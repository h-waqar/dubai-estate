// src\app\(frontend)\media\page.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image,
  Video,
  File,
  Search,
  Grid3x3,
  List,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  ImagePlus,
} from "lucide-react";
import { useMedia } from "@/modules/media/hooks/useMedia";
import { Media, MediaType } from "@/modules/media/types/media.types";
// import { handleActionError } from "@/lib/handleActionError";
import { handleClientError } from "@/lib/handleClientError";

// MediaLibraryModal Component
const MediaLibraryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: Media) => void;
  mode?: "select" | "manage";
}> = ({ isOpen, onClose, onSelect, mode = "select" }) => {
  const { mediaList, loading, error, fetchMedia, handleUpload, handleDelete } =
    useMedia();
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [filterType, setFilterType] = useState<MediaType | "ALL">("ALL");

  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [uploadType, setUploadType] = useState<MediaType | "AUTO">("AUTO");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith("image/")) return "IMAGE";
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type === "application/pdf") return "DOCUMENT";
    return "OTHER";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadError(null);
    const selected = e.target.files[0];

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "video/mp4",
      "application/pdf",
    ];
    if (!allowedTypes.includes(selected.type)) {
      setUploadError(
        "Unsupported file type. Allowed: PNG, JPEG, JPG, MP4, PDF"
      );
      return;
    }

    // Validate file size (50MB)
    if (selected.size > 50_000_000) {
      setUploadError("File is too large. Maximum size is 50MB");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setTitle(selected.name.replace(/\.[^/.]+$/, "")); // Remove extension
    if (uploadType === "AUTO") setUploadType(getMediaType(selected));
  };

  const onUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      await handleUpload({
        file,
        title: title || file.name,
        alt: alt || title || file.name,
        type: uploadType === "AUTO" ? getMediaType(file) : uploadType,
      });

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setAlt("");
      setUploadType("AUTO");
      setActiveTab("library");
    } catch (err: unknown) {
      const normalizedError = handleClientError(err);
      setUploadError(normalizedError.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      await handleDelete(id);
      if (selectedMedia?.id === id) {
        setSelectedMedia(null);
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
    }
  };

  const filteredMedia = mediaList.filter((media) => {
    const matchesSearch =
      media.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || media.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const getMediaIcon = (type: MediaType) => {
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
  };

  const renderMediaPreview = (media: Media, isSelected: boolean = false) => {
    const baseClasses = `relative rounded-lg overflow-hidden transition-all duration-200 ${
      isSelected
        ? "ring-2 ring-blue-500"
        : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
    }`;

    return (
      <div className={baseClasses}>
        <div className="aspect-video bg-gray-100 dark:bg-gray-800">
          {media.type === "IMAGE" && (
            <img
              src={media.url}
              alt={media.alt || media.title}
              className="w-full h-full object-cover"
            />
          )}
          {media.type === "VIDEO" && (
            <video
              src={media.url}
              className="w-full h-full object-cover"
              muted
            />
          )}
          {(media.type === "DOCUMENT" || media.type === "OTHER") && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                {getMediaIcon(media.type)}
                <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 px-2 truncate">
                  {media.title || "File"}
                </p>
              </div>
            </div>
          )}
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
            <Check className="w-4 h-4" />
          </div>
        )}
        {mode === "manage" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(media.id);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Media Library
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {mode === "select"
                ? "Select media to insert"
                : "Manage your media files"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "library"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "upload"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto w-">
          {activeTab === "library" ? (
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["ALL", "IMAGE", "VIDEO", "DOCUMENT", "OTHER"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type as MediaType | "ALL")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          filterType === type
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Media Grid/List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500">
                    <AlertCircle className="w-12 h-12 mb-3" />
                    <p className="text-lg font-medium">{error}</p>
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <ImagePlus className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No media found</p>
                    <p className="text-sm mt-1">
                      {searchQuery || filterType !== "ALL"
                        ? "Try adjusting your filters"
                        : "Upload some files to get started"}
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredMedia.map((media) => (
                      <div
                        key={media.id}
                        onClick={() => {
                          setSelectedMedia(media);
                          if (mode === "select" && onSelect) {
                            onSelect(media);
                          }
                        }}
                        className="cursor-pointer group"
                      >
                        {renderMediaPreview(
                          media,
                          selectedMedia?.id === media.id
                        )}
                        <div className="mt-2">
                          <p
                            className="text-sm font-medium text-gray-900 dark:text-white truncate"
                            title={media.title || "Untitled"}
                          >
                            {media.title || "Untitled"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(media.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMedia.map((media) => (
                      <div
                        key={media.id}
                        onClick={() => {
                          setSelectedMedia(media);
                          if (mode === "select" && onSelect) {
                            onSelect(media);
                          }
                        }}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMedia?.id === media.id
                            ? "bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="w-16 h-16 shrink-0">
                          {/* <div className="w-16 h-16 shrink-0"> */}
                          {renderMediaPreview(
                            media,
                            selectedMedia?.id === media.id
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {media.title || "Untitled"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {media.mimeType} • {formatFileSize(media.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          {getMediaIcon(media.type)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={onFileChange}
                      accept="image/png,image/jpeg,image/jpg,video/mp4,application/pdf"
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center gap-3 w-full p-12 border-2 border-dashed rounded-lg transition-colors ${
                        isUploading
                          ? "border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
                          : "border-gray-300 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500"
                      }`}
                    >
                      <Upload className="w-10 h-10 text-gray-400" />
                      <div className="text-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          Click to upload or drag and drop
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPEG, JPG, MP4, PDF (max 50MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {uploadError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {previewUrl && file && (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {(uploadType === "IMAGE" ||
                        file.type.startsWith("image/")) && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-contain"
                        />
                      )}
                      {(uploadType === "VIDEO" ||
                        file.type.startsWith("video/")) && (
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-64"
                        />
                      )}
                      {uploadType !== "IMAGE" &&
                        uploadType !== "VIDEO" &&
                        !file.type.startsWith("image/") &&
                        !file.type.startsWith("video/") && (
                          <div className="w-full h-64 flex items-center justify-center">
                            <div className="text-center">
                              <File className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {file.type}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={150}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Enter title"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {title.length}/150 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Alt Text (Accessibility)
                        </label>
                        <input
                          type="text"
                          value={alt}
                          onChange={(e) => setAlt(e.target.value)}
                          maxLength={150}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Describe this image for screen readers"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {alt.length}/150 characters
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          File Information
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            {file.type}
                          </p>
                          <p>
                            <span className="font-medium">Size:</span>{" "}
                            {formatFileSize(file.size)}
                          </p>
                          <p>
                            <span className="font-medium">Category:</span>{" "}
                            {uploadType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {activeTab === "library" && selectedMedia && (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Selected: {selectedMedia.title}
              </span>
            )}
            {activeTab === "library" && !selectedMedia && (
              <span>{filteredMedia.length} items</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            {activeTab === "library" ? (
              mode === "select" && (
                <button
                  onClick={() => {
                    if (selectedMedia && onSelect) {
                      onSelect(selectedMedia);
                      onClose();
                    }
                  }}
                  disabled={!selectedMedia}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Insert Media
                </button>
              )
            ) : (
              <button
                onClick={onUpload}
                disabled={!file || isUploading || !title.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Usage Component
export default function MediaLibraryDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Media Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Professional media management with upload, search, and selection
            capabilities
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <ImagePlus className="w-5 h-5" />
            Open Media Library
          </button>

          {selectedMedia && (
            <div className="mt-8 p-6 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Selected Media
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                  {selectedMedia.type === "IMAGE" ? (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <File className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {selectedMedia.title}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <span className="font-medium">ID:</span>{" "}
                      {selectedMedia.id}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedMedia.type}
                    </p>
                    <p>
                      <span className="font-medium">URL:</span>{" "}
                      <code className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedMedia.url}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <MediaLibraryModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(media) => {
            setSelectedMedia(media);
            setIsOpen(false);
          }}
          mode="select"
        />
      </div>
    </div>
  );
}
