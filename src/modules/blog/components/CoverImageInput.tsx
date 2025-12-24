import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import { Media } from "@/modules/media/types/media.types";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";
import { Control, useController } from "react-hook-form";
import { PostFormData } from "../types/post.types";

interface CoverImageInputProps {
  control: Control<PostFormData>;
  name: "coverImage";
  label?: string;
}

export function CoverImageInput({
  control,
  name,
  label = "Cover Image",
}: CoverImageInputProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleSelect = (media: Media) => {
    onChange(media.url);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <Label className="block text-sm font-medium">{label}</Label>

      {!value ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <MediaLibraryButton
            onSelect={handleSelect}
            buttonText="Select Cover Image"
            mode="select"
          />
          <p className="text-sm text-muted-foreground">
            Select an image from your media library
          </p>
        </div>
      ) : (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border group">
          <Image
            src={value}
            alt="Cover preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <MediaLibraryButton
              onSelect={handleSelect}
              buttonText="Change"
              buttonClassName="px-4 py-2 bg-white/90 text-black rounded-lg hover:bg-white transition-colors flex items-center gap-2 font-medium text-sm"
              mode="select"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium text-sm"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      )}

      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
