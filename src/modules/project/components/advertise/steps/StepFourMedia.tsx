"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import type { Media } from "@/modules/media/types/media.types";
import { cn } from "@/lib/utils";

// Reusable component for media preview
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
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    // Handle logo selection
    const handleLogoSelect = (media: Media) => {
        store.update({ logo: media });
    };

    const handleLogoRemove = () => {
        store.update({ logo: undefined });
    };

    // Handle cover image selection
    const handleCoverSelect = (media: Media) => {
        store.update({ coverImage: media });
    };

    const handleCoverRemove = () => {
        store.update({ coverImage: undefined });
    };

    // Handle gallery selection
    const handleGallerySelect = (media: Media) => {
        if (!store.gallery.find((img) => img.id === media.id)) {
            store.update({ gallery: [...store.gallery, media] });
        }
    };

    const handleGalleryRemove = (index: number) => {
        const newGallery = store.gallery.filter((_, i) => i !== index);
        store.update({ gallery: newGallery });
    };

    const handleNext = () => {
        next();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    🖼️ 04 Media
                </h2>

                {/* Logo Upload */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Developer Logo</h3>
                        <MediaLibraryButton
                            onSelect={handleLogoSelect}
                            buttonText={store.logo ? "Change Logo" : "Select Logo"}
                            mode="select"
                        />
                    </div>
                    <div
                        className={cn(
                            "p-4 border border-dashed rounded-lg min-h-[120px] flex items-center justify-center",
                            !store.logo && "bg-muted/30"
                        )}
                    >
                        {store.logo ? (
                            <div className="relative group">
                                <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-border">
                                    <Image
                                        src={store.logo.url}
                                        alt="Developer logo"
                                        fill
                                        sizes="128px"
                                        className="object-contain bg-white p-2"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogoRemove}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-40 cursor-pointer"
                                    aria-label="Remove logo"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <p className="text-sm text-muted-foreground mt-2 truncate">
                                    {store.logo.title}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImagePlus className="w-10 h-10 mx-auto" />
                                <p className="mt-2 text-sm font-medium">Select developer logo</p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-border" />

                {/* Cover Image */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Cover Image *</h3>
                        <MediaLibraryButton
                            onSelect={handleCoverSelect}
                            buttonText={store.coverImage ? "Change Cover" : "Select Cover"}
                            mode="select"
                        />
                    </div>
                    <div
                        className={cn(
                            "p-4 border border-dashed rounded-lg min-h-[150px] flex items-center justify-center",
                            !store.coverImage && "bg-muted/30"
                        )}
                    >
                        {store.coverImage ? (
                            <div className="relative group w-full">
                                <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
                                    <Image
                                        src={store.coverImage.url}
                                        alt="Cover image"
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
                                    {store.coverImage.title}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImagePlus className="w-10 h-10 mx-auto" />
                                <p className="mt-2 text-sm font-medium">Select a cover image</p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-border" />

                {/* Progress Update Image */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Progress Update Image</h3>
                        <MediaLibraryButton
                            onSelect={(media) => store.update({ progressImage: media })}
                            buttonText={store.progressImage ? "Change Image" : "Select Image"}
                            mode="select"
                        />
                    </div>
                    <div
                        className={cn(
                            "p-4 border border-dashed rounded-lg min-h-[150px] flex items-center justify-center",
                            !store.progressImage && "bg-muted/30"
                        )}
                    >
                        {store.progressImage ? (
                            <div className="relative group w-full">
                                <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
                                    <Image
                                        src={store.progressImage.url}
                                        alt="Progress update"
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => store.update({ progressImage: undefined })}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-40 cursor-pointer"
                                    aria-label="Remove progress image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImagePlus className="w-10 h-10 mx-auto" />
                                <p className="mt-2 text-sm font-medium">Select a progress update image</p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-border" />

                {/* Gallery */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                            Gallery Images{" "}
                            <span className="text-sm text-muted-foreground">
                                ({store.gallery.length} / 20)
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
                            store.gallery.length === 0 && "flex items-center justify-center"
                        )}
                    >
                        {store.gallery.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {store.gallery.map((image, index) => (
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

            <div className="flex justify-between">
                <Button type="button" onClick={prev} variant="outline">
                    Back
                </Button>
                <Button onClick={handleNext}>Next: Floorplans</Button>
            </div>
        </div>
    );
}
