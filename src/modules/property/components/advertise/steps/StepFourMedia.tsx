// // src/modules/property/advertise/components/steps/StepFourMedia.tsx
// "use client";

// import Image from "next/image";
// import { ImagePlus, Upload, Video, X } from "lucide-react";
// import { useStepStore } from "../../../stores/useStepStore";
// import StepController from "./StepController";
// import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
// import type { Media } from "@/modules/media/types/media.types"; // Assuming this path from your example
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// // Reusable component for the media item preview
// function MediaPreview({
//   media,
//   onRemove,
// }: {
//   media: Media;
//   onRemove: () => void;
// }) {
//   return (
//     <div className="relative group w-40 h-32">
//       <Image
//         src={media.url}
//         alt={media.alt || media.title || "Uploaded media"}
//         fill
//         sizes="160px"
//         className="object-cover rounded-lg border border-border"
//       />
//       <button
//         type="button"
//         onClick={onRemove}
//         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-40 cursor-pointer"
//         aria-label="Remove image"
//       >
//         <X className="w-4 h-4" />
//       </button>
//       <p className="text-xs text-muted-foreground mt-1 truncate">
//         {media.title}
//       </p>
//     </div>
//   );
// }

// export default function StepFourMedia() {
//   const { data, updateData, next, prev } = useStepStore();

//   // Get media from the store, providing defaults
//   const coverImage = data.coverImage as Media | null;
//   const gallery = (data.gallery || []) as Media[];

//   // --- Cover Image Handlers ---
//   const handleCoverSelect = (media: Media) => {
//     updateData({ coverImage: media });
//   };

//   const handleCoverRemove = () => {
//     updateData({ coverImage: null });
//   };

//   // --- Gallery Handlers ---
//   const handleGallerySelect = (media: Media) => {
//     // Avoid duplicates
//     if (!gallery.find((img) => img.id === media.id)) {
//       updateData({ gallery: [...gallery, media] });
//     }
//   };

//   const handleGalleryRemove = (index: number) => {
//     const newGallery = gallery.filter((_, i) => i !== index);
//     updateData({ gallery: newGallery });
//   };

//   return (
//     <div className="space-y-8">
//       {/* Card container */}
//       <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
//         {/* Header */}
//         <h2 className="text-2xl font-semibold flex items-center gap-2">
//           🖼️ 04 Media
//         </h2>

//         {/* --- Cover Image Section ("My Photos") --- */}
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium">Cover Image</h3>
//             <MediaLibraryButton
//               onSelect={handleCoverSelect}
//               buttonText={coverImage ? "Change Cover" : "Select Cover"}
//               mode="select"
//             />
//           </div>
//           <div
//             className={cn(
//               "p-4 border border-dashed rounded-lg min-h-[150px] flex items-center justify-center",
//               !coverImage && "bg-muted/30"
//             )}
//           >
//             {coverImage ? (
//               <MediaPreview media={coverImage} onRemove={handleCoverRemove} />
//             ) : (
//               <div className="text-center text-muted-foreground">
//                 <ImagePlus className="w-10 h-10 mx-auto" />
//                 <p className="mt-2 text-sm font-medium">Select a cover image</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Divider */}
//         <hr className="border-border" />

//         {/* --- Gallery Section ("My Videos" -> Gallery) --- */}
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium">
//               Gallery Images{" "}
//               <span className="text-sm text-muted-foreground">
//                 ({gallery.length} / 20)
//               </span>
//             </h3>
//             <MediaLibraryButton
//               onSelect={handleGallerySelect}
//               buttonText="Add to Gallery"
//               mode="select"
//             />
//           </div>
//           <div
//             className={cn(
//               "p-4 border border-dashed rounded-lg min-h-[170px]",
//               gallery.length === 0 && "flex items-center justify-center"
//             )}
//           >
//             {gallery.length > 0 ? (
//               <div className="flex flex-wrap gap-1">
//                 {gallery.map((image, index) => (
//                   <MediaPreview
//                     key={image.id}
//                     media={image}
//                     onRemove={() => handleGalleryRemove(index)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center text-muted-foreground">
//                 <Upload className="w-10 h-10 mx-auto" />
//                 <p className="mt-2 text-sm font-medium">
//                   Add photos to your gallery
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <StepController onNext={next} onPrev={prev} showPrev={true} />
//     </div>
//   );
// }

// ======================================================
// ======================================================
// ======================================================

// src/modules/property/advertise/components/steps/StepFourMedia.tsx
"use client";

import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { useStepStore } from "../../../stores/useStepStore";
import StepController from "./StepController";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import type { Media } from "@/modules/media/types/media.types"; // Assuming this path from your example
import { cn } from "@/lib/utils";

// Reusable component for the media item preview (FOR GALLERY)
function MediaPreview({
  media,
  onRemove,
}: {
  media: Media;
  onRemove: () => void;
}) {
  return (
    <div className="relative group w-40 h-32">
      <Image
        src={media.url}
        alt={media.alt || media.title || "Uploaded media"}
        fill
        sizes="160px"
        className="object-cover rounded-lg border border-border"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-40 cursor-pointer"
        aria-label="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-xs text-muted-foreground mt-1 truncate">
        {media.title}
      </p>
    </div>
  );
}

export default function StepFourMedia() {
  const { data, updateData, next, prev } = useStepStore();

  // Get media from the store, providing defaults
  const coverImage = data.coverImage as Media | null;
  const gallery = (data.gallery || []) as Media[];

  // --- Cover Image Handlers ---
  const handleCoverSelect = (media: Media) => {
    updateData({ coverImage: media });
  };

  const handleCoverRemove = () => {
    updateData({ coverImage: null });
  };

  // --- Gallery Handlers ---
  const handleGallerySelect = (media: Media) => {
    // Avoid duplicates
    if (!gallery.find((img) => img.id === media.id)) {
      updateData({ gallery: [...gallery, media] });
    }
  };

  const handleGalleryRemove = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    updateData({ gallery: newGallery });
  };

  return (
    <div className="space-y-8">
      {/* Card container */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Header */}
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          🖼️ 04 Media
        </h2>

        {/* --- Cover Image Section ("My Photos") --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Cover Image</h3>
            <MediaLibraryButton
              onSelect={handleCoverSelect}
              buttonText={coverImage ? "Change Cover" : "Select Cover"}
              mode="select"
            />
          </div>
          <div
            className={cn(
              "p-4 border border-dashed rounded-lg min-h-[150px] flex items-center justify-center",
              !coverImage && "bg-muted/30"
            )}
          >
            {coverImage ? (
              // --- MODIFICATION START ---
              // Use a full-width preview for the cover image
              <div className="relative group w-full">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={coverImage.url}
                    alt={coverImage.alt || coverImage.title || "Cover image"}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCoverRemove}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-40 cursor-pointer"
                  aria-label="Remove cover image"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-sm text-muted-foreground mt-2 truncate">
                  {coverImage.title}
                </p>
              </div>
            ) : (
              // --- MODIFICATION END ---
              <div className="text-center text-muted-foreground">
                <ImagePlus className="w-10 h-10 mx-auto" />
                <p className="mt-2 text-sm font-medium">Select a cover image</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border" />

        {/* --- Gallery Section ("My Videos" -> Gallery) --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Gallery Images{" "}
              <span className="text-sm text-muted-foreground">
                ({gallery.length} / 20)
              </span>
            </h3>
            <MediaLibraryButton
              onSelect={handleGallerySelect}
              buttonText="Add to Gallery"
              mode="select"
            />
          </div>
          <div
            className={cn(
              "p-4 border border-dashed rounded-lg min-h-[170px]",
              gallery.length === 0 && "flex items-center justify-center"
            )}
          >
            {gallery.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {gallery.map((image, index) => (
                  <MediaPreview
                    key={image.id}
                    media={image}
                    onRemove={() => handleGalleryRemove(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="w-10 h-10 mx-auto" />
                <p className="mt-2 text-sm font-medium">
                  Add photos to your gallery
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepController onNext={next} onPrev={prev} showPrev={true} />
    </div>
  );
}
