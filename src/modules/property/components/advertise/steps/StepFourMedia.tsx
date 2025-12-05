import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import StepController from "./StepController";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import type { Media } from "@/modules/media/types/media.types";
import { cn } from "@/lib/utils";
import { stepFourSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";

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

interface StepFourMediaProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

type StepFourData = {
  coverImage: Media | null | undefined;
  gallery: Media[];
};

export default function StepFourMedia({}: StepFourMediaProps) {
  const { next, prev } = useStepStore();
  const { coverImage, gallery, update } = useAdvertiseFormStore();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFourData>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      coverImage: coverImage || undefined,
      gallery: gallery || [],
    },
  });

  const currentCoverImage = watch("coverImage");
  const currentGallery = watch("gallery");

  // Sync form -> store
  useEffect(() => {
    const subscription = watch((value) => {
      // We need to cast because react-hook-form might treat them as partials or slightly different types
      // depending on how Zod schema is defined vs actual Media type.
      // Assuming Media type matches what's expected.
      if (value.coverImage !== undefined) {
         update({ coverImage: value.coverImage as Media | null });
      }
      if (value.gallery !== undefined) {
         update({ gallery: value.gallery as Media[] });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  // --- Cover Image Handlers ---
  const handleCoverSelect = (media: Media) => {
    setValue("coverImage", media, { shouldValidate: true });
  };

  const handleCoverRemove = () => {
    setValue("coverImage", null as any, { shouldValidate: true }); // Cast to any to allow null if schema permits or just undefined
    // Schema says: coverImage: z.object({ id: z.number() }, { message: "Cover image is required." })
    // So it shouldn't be null. But initially it is null/undefined.
    // If I set it to undefined, it might trigger validation error.
  };

  // --- Gallery Handlers ---
  const handleGallerySelect = (media: Media) => {
    // Avoid duplicates
    const current = currentGallery || [];
    if (!current.find((img) => img.id === media.id)) {
      setValue("gallery", [...current, media], { shouldValidate: true });
    }
  };

  const handleGalleryRemove = (index: number) => {
    const current = currentGallery || [];
    const newGallery = current.filter((_, i) => i !== index);
    setValue("gallery", newGallery, { shouldValidate: true });
  };

  const onSubmit = () => {
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              buttonText={currentCoverImage ? "Change Cover" : "Select Cover"}
              mode="select"
            />
          </div>
          <div
            className={cn(
              "p-4 border border-dashed rounded-lg min-h-[150px] flex items-center justify-center",
              !currentCoverImage && "bg-muted/30"
            )}
          >
            {currentCoverImage ? (
              // Use a full-width preview for the cover image
              <div className="relative group w-full">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
                  <Image
                    src={currentCoverImage.url}
                    alt={currentCoverImage.alt || currentCoverImage.title || "Cover image"}
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
                  {currentCoverImage.title}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImagePlus className="w-10 h-10 mx-auto" />
                <p className="mt-2 text-sm font-medium">Select a cover image</p>
              </div>
            )}
          </div>
          {errors.coverImage && (
            <p className="text-sm text-destructive mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-border" />

        {/* --- Gallery Section ("My Videos" -> Gallery) --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Gallery Images{" "}
              <span className="text-sm text-muted-foreground">
                ({currentGallery?.length || 0} / 20)
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
              (!currentGallery || currentGallery.length === 0) && "flex items-center justify-center"
            )}
          >
            {currentGallery && currentGallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentGallery.map((image, index) => (
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
          {errors.gallery && (
            <p className="text-sm text-destructive mt-1">
              {errors.gallery.message}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <StepController 
        onNext={handleSubmit(onSubmit)}
        onPrev={prev} 
        showPrev={true} 
      />
    </form>
  );
}
