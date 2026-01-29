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
        // <div className="relative group w-40 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border">
        <div className="relative group w-40 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border border-border">
            {media.type === "VIDEO" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 group relative rounded-lg overflow-hidden">
                    <video
                        src={`${media.url}#t=0.1`}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-8 h-8 text-white/90"
                        >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                </div>
            ) : media.type === "DOCUMENT" ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-lg overflow-hidden">
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
                    className="object-cover rounded-lg overflow-hidden"
                />
            )}

            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 z-40 cursor-pointer"
                aria-label="Remove image"
            >
                <X className="w-4 h-4" />
            </button>
            {media.type !== "DOCUMENT" && (
                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
                    {media.title}
                </p>
            )}
        </div>
    );
}

import { toast } from "sonner"; // Assuming sonner is used for toasts

export default function StepFourMedia() {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    // Handle logo selection
    const handleLogoSelect = (media: Media) => {
        if (media.type !== "IMAGE") {
            toast.error("Logo must be an image file.");
            return;
        }
        store.update({ logo: media });
    };

    const handleLogoRemove = () => {
        store.update({ logo: undefined });
    };

    // Handle cover image selection
    const handleCoverSelect = (media: Media) => {
        if (media.type !== "IMAGE") {
            toast.error("Cover image must be an image file.");
            return;
        }
        store.update({ coverImage: media });
    };

    const handleCoverRemove = () => {
        store.update({ coverImage: undefined });
    };

    // Handle gallery selection
    const handleGallerySelect = (media: Media | Media[]) => {
        const newItems = Array.isArray(media) ? media : [media];
        const uniqueItems = newItems.filter(item => !store.gallery.find((img) => img.id === item.id));
        if (uniqueItems.length > 0) {
             store.update({ gallery: [...store.gallery, ...uniqueItems] });
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
                            onSelect={(m) => !Array.isArray(m) && handleLogoSelect(m)}
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
                            onSelect={(m) => !Array.isArray(m) && handleCoverSelect(m)}
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
                            onSelect={(media) => !Array.isArray(media) && store.update({ progressImage: media })}
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
                            selectionMode="multiple"
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
