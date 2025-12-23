import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import StepController from "./StepController";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import type { Media } from "@/modules/media/types/media.types";
import { cn } from "@/lib/utils";
import { stepFourSchema } from "../../../validators/advertise-steps.validator";
import { updatePropertyAction } from "@/modules/property/actions/updateProperty";

// Reusable component for the media item preview (FOR GALLERY)
function MediaPreview({
  media,
  onRemove,
}: {
  media: Media;
  onRemove: () => void;
}) {
  return (
    <div className="relative group w-40 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border">
      {media.type === "VIDEO" ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          {/* Using Lucide Play icon directly since we can't easily import the other component's styles */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-white opacity-80"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <video
            src={media.url}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            muted
            playsInline
          />
        </div>
      ) : media.type === "DOCUMENT" ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-gray-400 mb-1"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p className="text-[10px] text-center text-gray-500 truncate w-full px-1">
            {media.title || "Document"}
          </p>
        </div>
      ) : (
        <Image
          src={media.url}
          alt={media.alt || media.title || "Uploaded media"}
          fill
          sizes="160px"
          className="object-cover"
        />
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-40 cursor-pointer"
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </button>
      {/* Title overlay only for images/videos that don't have it inline */}
      {media.type !== "DOCUMENT" && (
        <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
          {media.title}
        </p>
      )}
    </div>
  );
}

interface StepFourMediaProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
  isEditMode?: boolean;
  propertyId?: number;
}

type StepFourData = {
  coverImage: Media | null | undefined;
  gallery: Media[];
};

export default function StepFourMedia({ isEditMode, propertyId, serverData }: StepFourMediaProps) {
  const { next, prev } = useStepStore();
  const router = useRouter();
  const { coverImage, gallery, update } = useAdvertiseFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setValue("coverImage", null as any, { shouldValidate: true });
  };

  // --- Gallery Handlers ---
  const handleGallerySelect = (media: Media) => {
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

  const onSubmit = async () => {
    if (isEditMode && propertyId) {
      setIsSubmitting(true);
      try {
        const state = useAdvertiseFormStore.getState();

        const formData = new FormData();
        formData.append("title", state.title);
        formData.append("price", String(state.price || 0));
        formData.append("listingType", state.listingType);
        formData.append("propertyTypeId", String(state.propertyTypeId));
        formData.append("bedrooms", String(state.bedrooms || 0));
        formData.append("bathrooms", String(state.bathrooms || 0));
        formData.append("location", state.location);
        formData.append("latitude", String(state.latitude || 0));
        formData.append("longitude", String(state.longitude || 0));
        formData.append("furnishing", state.furnishing);
        formData.append("description", state.description);

        // Map feature names to IDs using serverData
        const featureMap = new Map(serverData.features?.map(f => [f.name, f.id]) || []);
        state.features.forEach(name => {
          const id = featureMap.get(name);
          if (id) {
            formData.append("features[]", String(id));
          }
        });

        if (state.coverImage?.id) formData.append("coverImage", String(state.coverImage.id));
        state.gallery.forEach(m => formData.append("gallery[]", String(m.id)));

        const result = await updatePropertyAction(propertyId, formData);

        if (result.success) {
          toast.success("Property updated successfully!");
          useAdvertiseFormStore.getState().reset(); // Reset form data
          router.push("/agent/dashboard");
          return;
        } else {
          toast.error("Failed to update property: " + JSON.stringify(result.error));
        }

      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      next();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          🖼️ 04 Media
        </h2>

        {/* --- Cover Image --- */}
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

        <hr className="border-border" />

        {/* --- Gallery --- */}
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

      <StepController
        onNext={handleSubmit(onSubmit)}
        onPrev={prev}
        showPrev={true}
        nextLabel={isEditMode ? "Update Property" : undefined}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
