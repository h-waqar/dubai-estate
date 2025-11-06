// // =============================================================================
// // FILE: src/modules/media/components/MediaUploadView.tsx
// // =============================================================================
// "use client";

// import { useState, useEffect } from "react";
// import { Upload, File, AlertCircle, Loader2 } from "lucide-react";
// import { MediaType } from "../types/media.types";
// import { useMedia } from "../hooks/useMedia";
// import { formatFileSize } from "../utils/formatFileSize";
// import { handleClientError } from "@/lib/handleClientError";

// interface MediaUploadViewProps {
//   onUploadSuccess: () => void;
// }

// export default function MediaUploadView({
//   onUploadSuccess,
// }: MediaUploadViewProps) {
//   const { handleUpload } = useMedia();
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [title, setTitle] = useState("");
//   const [alt, setAlt] = useState("");
//   const [uploadType, setUploadType] = useState<MediaType | "AUTO">("AUTO");
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const getMediaType = (file: File): MediaType => {
//     if (file.type.startsWith("image/")) return "IMAGE";
//     if (file.type.startsWith("video/")) return "VIDEO";
//     if (file.type === "application/pdf") return "DOCUMENT";
//     return "OTHER";
//   };

//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.[0]) return;

//     setUploadError(null);
//     const selected = e.target.files[0];

//     const allowedTypes = [
//       "image/png",
//       "image/jpeg",
//       "image/jpg",
//       "video/mp4",
//       "application/pdf",
//     ];
//     if (!allowedTypes.includes(selected.type)) {
//       setUploadError(
//         "Unsupported file type. Allowed: PNG, JPEG, JPG, MP4, PDF"
//       );
//       return;
//     }

//     if (selected.size > 50_000_000) {
//       setUploadError("File is too large. Maximum size is 50MB");
//       return;
//     }

//     setFile(selected);
//     setPreviewUrl(URL.createObjectURL(selected));
//     setTitle(selected.name.replace(/\.[^/.]+$/, ""));
//     if (uploadType === "AUTO") setUploadType(getMediaType(selected));
//   };

//   const onUpload = async () => {
//     if (!file) return;

//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       await handleUpload({
//         file,
//         title: title || file.name,
//         alt: alt || title || file.name,
//         type: uploadType === "AUTO" ? getMediaType(file) : uploadType,
//       });

//       setFile(null);
//       setPreviewUrl(null);
//       setTitle("");
//       setAlt("");
//       setUploadType("AUTO");
//       onUploadSuccess();
//     } catch (err: unknown) {
//       const error = handleClientError(err);
//       setUploadError(error.message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="h-full overflow-y-auto p-6">
//       <div className="max-w-2xl mx-auto space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Choose File
//           </label>
//           <div className="relative">
//             <input
//               type="file"
//               onChange={onFileChange}
//               accept="image/png,image/jpeg,image/jpg,video/mp4,application/pdf"
//               className="hidden"
//               id="file-upload"
//               disabled={isUploading}
//             />
//             <label
//               htmlFor="file-upload"
//               className={`flex flex-col items-center justify-center gap-3 w-full p-12 border-2 border-dashed rounded-lg transition-colors ${
//                 isUploading
//                   ? "border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
//                   : "border-gray-300 dark:border-gray-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500"
//               }`}
//             >
//               <Upload className="w-10 h-10 text-gray-400" />
//               <div className="text-center">
//                 <span className="text-gray-600 dark:text-gray-400 font-medium">
//                   Click to upload or drag and drop
//                 </span>
//                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                   PNG, JPEG, JPG, MP4, PDF (max 50MB)
//                 </p>
//               </div>
//             </label>
//           </div>

//           {uploadError && (
//             <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
//               <p className="text-sm text-red-600 dark:text-red-400">
//                 {uploadError}
//               </p>
//             </div>
//           )}
//         </div>

//         {previewUrl && file && (
//           <div className="space-y-4">
//             <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//               {(uploadType === "IMAGE" || file.type.startsWith("image/")) && (
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   className="w-full h-64 object-cover"
//                 />
//               )}
//               {(uploadType === "VIDEO" || file.type.startsWith("video/")) && (
//                 <video src={previewUrl} controls className="w-full h-64" />
//               )}
//               {uploadType !== "IMAGE" &&
//                 uploadType !== "VIDEO" &&
//                 !file.type.startsWith("image/") &&
//                 !file.type.startsWith("video/") && (
//                   <div className="w-full h-64 flex items-center justify-center">
//                     <div className="text-center">
//                       <File className="w-16 h-16 mx-auto text-gray-400 mb-3" />
//                       <p className="text-gray-600 dark:text-gray-400 font-medium">
//                         {file.name}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                         {file.type}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   maxLength={150}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   placeholder="Enter title"
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                   {title.length}/150 characters
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Alt Text (Accessibility)
//                 </label>
//                 <input
//                   type="text"
//                   value={alt}
//                   onChange={(e) => setAlt(e.target.value)}
//                   maxLength={150}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   placeholder="Describe this image for screen readers"
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                   {alt.length}/150 characters
//                 </p>
//               </div>

//               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
//                   File Information
//                 </h4>
//                 <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
//                   <p>
//                     <span className="font-medium">Type:</span> {file.type}
//                   </p>
//                   <p>
//                     <span className="font-medium">Size:</span>{" "}
//                     {formatFileSize(file.size)}
//                   </p>
//                   <p>
//                     <span className="font-medium">Category:</span> {uploadType}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={onUpload}
//                 disabled={!file || isUploading || !title.trim()}
//                 className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5" />
//                     Upload Media
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// ================================================
// ================================================
// ================================================

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, File, AlertCircle, Loader2 } from "lucide-react";
import { MediaType } from "../types/media.types";
import { useMedia } from "../hooks/useMedia";
import { formatFileSize } from "../utils/formatFileSize";
import { handleClientError } from "@/lib/handleClientError";

interface MediaUploadViewProps {
  onUploadSuccess: () => void;
}

export default function MediaUploadView({
  onUploadSuccess,
}: MediaUploadViewProps) {
  const { handleUpload } = useMedia();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [uploadType, setUploadType] = useState<MediaType | "AUTO">("AUTO");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

    setUploadError(null);
    const selected = e.target.files[0];

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

    if (selected.size > 50_000_000) {
      setUploadError("File is too large. Maximum size is 50MB");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setTitle(selected.name.replace(/\.[^/.]+$/, ""));
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

      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setAlt("");
      setUploadType("AUTO");
      onUploadSuccess();
    } catch (err: unknown) {
      const error = handleClientError(err);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
              {(uploadType === "IMAGE" || file.type.startsWith("image/")) && (
                <div className="relative w-full h-64">
                  <Image
                    src={previewUrl}
                    alt={alt || title || "Preview"}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              {(uploadType === "VIDEO" || file.type.startsWith("video/")) && (
                <video src={previewUrl} controls className="w-full h-64" />
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

            {/* Metadata & Upload */}
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
                    <span className="font-medium">Type:</span> {file.type}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{" "}
                    {formatFileSize(file.size)}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span> {uploadType}
                  </p>
                </div>
              </div>

              <button
                onClick={onUpload}
                disabled={!file || isUploading || !title.trim()}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Media
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
