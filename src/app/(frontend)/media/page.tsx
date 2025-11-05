// // ==============================================================================
// // FILE: src/app/(frontend)/media/page.tsx
// // ==============================================================================
// "use client";

// import { useState } from "react";
// import { Media } from "@/modules/media/types/media.types";
// import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
// import { Check, File, X } from "lucide-react";
// // import Image  from "next/image";

// export default function MediaLibraryDemo() {
//   const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
//   const [coverImage, setCoverImage] = useState<Media | null>(null);
//   const [galleryImages, setGalleryImages] = useState<Media[]>([]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Media Library Demo
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Test the media library in different modes
//           </p>
//         </div>

//         {/* Basic Selection Demo */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Basic Selection
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Click the button to select a single media item
//           </p>

//           <div className="space-y-4">
//             <MediaLibraryButton
//               onSelect={(media) => setSelectedMedia(media)}
//               buttonText="Select Media"
//               mode="select"
//             />

//             {selectedMedia && (
//               <div className="p-6 bg-lineara-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                   <Check className="w-5 h-5 text-green-500" />
//                   Selected Media
//                 </h3>
//                 <div className="flex items-start gap-4">
//                   <div className="w-24 h-24 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
//                     {selectedMedia.type === "IMAGE" ? (
//                       <img
//                         src={selectedMedia.url}
//                         alt={selectedMedia.alt}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <File className="w-8 h-8 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 dark:text-white text-lg">
//                       {selectedMedia.title}
//                     </p>
//                     <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
//                       <p>
//                         <span className="font-medium">ID:</span>{" "}
//                         {selectedMedia.id}
//                       </p>
//                       <p>
//                         <span className="font-medium">Type:</span>{" "}
//                         {selectedMedia.type}
//                       </p>
//                       <p className="break-all">
//                         <span className="font-medium">URL:</span>{" "}
//                         <code className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded">
//                           {selectedMedia.url}
//                         </code>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Management Demo */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Management Mode
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Open the media library with delete capabilities enabled
//           </p>

//           <MediaLibraryButton
//             onSelect={(media) => console.log("Selected:", media)}
//             buttonText="Manage Media Library"
//             mode="manage"
//             allowDelete={true}
//             buttonClassName="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
//           />
//         </div>

//         {/* Form Example */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Form Integration Example
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Example of using media library in a post/article form
//           </p>

//           <div className="space-y-6">
//             {/* Cover Image */}
//             <div>
//               <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
//                 Cover Image
//               </label>
//               <MediaLibraryButton
//                 onSelect={(media) => setCoverImage(media)}
//                 buttonText={coverImage ? "Change Cover" : "Select Cover"}
//                 mode="select"
//               />
//               {coverImage && (
//                 <div className="mt-4 relative inline-block">
//                   <img
//                     src={coverImage.url}
//                     alt={coverImage.alt}
//                     className="w-48 h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
//                   />
//                   <button
//                     onClick={() => setCoverImage(null)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//                     {coverImage.title}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Gallery Images */}
//             <div>
//               <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
//                 Gallery Images ({galleryImages.length})
//               </label>
//               <MediaLibraryButton
//                 onSelect={(media) => {
//                   // Prevent duplicates
//                   if (!galleryImages.find((img) => img.id === media.id)) {
//                     setGalleryImages([...galleryImages, media]);
//                   }
//                 }}
//                 buttonText="Add to Gallery"
//                 mode="select"
//               />

//               {galleryImages.length > 0 && (
//                 <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {galleryImages.map((image, index) => (
//                     <div key={image.id} className="relative group">
//                       <img
//                         src={image.url}
//                         alt={image.alt}
//                         className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
//                       />
//                       <button
//                         onClick={() => {
//                           setGalleryImages(
//                             galleryImages.filter((_, i) => i !== index)
//                           );
//                         }}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                       <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
//                         {image.title}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {galleryImages.length > 0 && (
//                 <button
//                   onClick={() => setGalleryImages([])}
//                   className="mt-4 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                 >
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {/* Form Actions */}
//             <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => {
//                   console.log({
//                     coverImage: coverImage?.id,
//                     galleryImages: galleryImages.map((img) => img.id),
//                   });
//                   alert("Check console for form data");
//                 }}
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
//                 disabled={!coverImage}
//               >
//                 Save Post
//               </button>
//               <button
//                 onClick={() => {
//                   setCoverImage(null);
//                   setGalleryImages([]);
//                 }}
//                 className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
//               >
//                 Reset Form
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// =======================================
// =======================================
// =======================================
"use client";

import { useState } from "react";
import Image from "next/image";
import { Media } from "@/modules/media/types/media.types";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import { Check, File, X } from "lucide-react";

export default function MediaLibraryDemo() {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [coverImage, setCoverImage] = useState<Media | null>(null);
  const [galleryImages, setGalleryImages] = useState<Media[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Media Library Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the media library in different modes
          </p>
        </div>

        {/* Basic Selection Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Selection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button to select a single media item
          </p>

          <div className="space-y-4">
            <MediaLibraryButton
              onSelect={(media) => setSelectedMedia(media)}
              buttonText="Select Media"
              mode="select"
            />

            {selectedMedia && (
              <div className="p-6 bg-lineara-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Selected Media
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700 relative">
                    {selectedMedia.type === "IMAGE" ? (
                      <Image
                        src={selectedMedia.url}
                        alt={
                          selectedMedia.alt ||
                          selectedMedia.title ||
                          "Media image"
                        }
                        fill
                        sizes="96px"
                        className="object-cover"
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
                      <p className="break-all">
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
        </div>

        {/* Management Mode */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Management Mode
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Open the media library with delete capabilities enabled
          </p>

          <MediaLibraryButton
            onSelect={(media) => console.log("Selected:", media)}
            buttonText="Manage Media Library"
            mode="manage"
            allowDelete
            buttonClassName="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
          />
        </div>

        {/* Form Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Form Integration Example
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Example of using media library in a post/article form
          </p>

          <div className="space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Cover Image
              </label>
              <MediaLibraryButton
                onSelect={(media) => setCoverImage(media)}
                buttonText={coverImage ? "Change Cover" : "Select Cover"}
                mode="select"
              />
              {coverImage && (
                <div className="mt-4 relative inline-block">
                  <div className="w-48 h-48 relative">
                    <Image
                      src={coverImage.url}
                      alt={coverImage.alt || coverImage.title || "Cover image"}
                      fill
                      sizes="192px"
                      className="object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {coverImage.title}
                  </p>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Gallery Images ({galleryImages.length})
              </label>
              <MediaLibraryButton
                onSelect={(media) => {
                  if (!galleryImages.find((img) => img.id === media.id)) {
                    setGalleryImages([...galleryImages, media]);
                  }
                }}
                buttonText="Add to Gallery"
                mode="select"
              />

              {galleryImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="w-full h-32 relative">
                        <Image
                          src={image.url}
                          alt={image.alt || image.title || "Gallery image"}
                          fill
                          sizes="128px"
                          className="object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setGalleryImages(
                            galleryImages.filter((_, i) => i !== index)
                          );
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {image.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {galleryImages.length > 0 && (
                <button
                  onClick={() => setGalleryImages([])}
                  className="mt-4 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  console.log({
                    coverImage: coverImage?.id,
                    galleryImages: galleryImages.map((img) => img.id),
                  });
                  alert("Check console for form data");
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                disabled={!coverImage}
              >
                Save Post
              </button>
              <button
                onClick={() => {
                  setCoverImage(null);
                  setGalleryImages([]);
                }}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
