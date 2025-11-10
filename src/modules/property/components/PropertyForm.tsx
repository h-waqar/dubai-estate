"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FurnishingStatus } from "@/generated/prisma";

import { createPropertyValidator } from "../validators/createProperty.validator";
import type { CreatePropertyInput } from "../types/property.types";
import { createPropertyAction } from "../actions/createProperty";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Image from "next/image";
import { Media } from "@/modules/media/types/media.types";
import MediaLibraryButton from "@/modules/media/components/MediaLibraryButton";
import { Check, File, X } from "lucide-react";
import { useState } from "react";

interface PropertyFormProps {
  propertyTypes: { id: number; name: string }[];
}

export function PropertyForm({ propertyTypes }: PropertyFormProps) {
  const [coverImage, setCoverImage] = useState<Media | null>(null);
  const [galleryImages, setGalleryImages] = useState<Media[]>([]);

  const form = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertyValidator),
    defaultValues: {
      title: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      location: "",
      description: "",
      furnishing: "UNFURNISHED",
      propertyTypeId: 0,
      coverImage: 0,
      gallery: [],
    },
  });

  async function onSubmit(values: CreatePropertyInput) {
    console.log("onSubmit called");

    if (!coverImage) {
      toast.error("Please select a cover image");
      return;
    }

    const payload = {
      ...values,
      coverImage: coverImage.id,
      gallery: galleryImages.map((img) => img.id),
    };

    // Convert to FormData for server action
    const formData = new FormData();
    console.log(formData);

    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, String(value));
      }
    });

    const result = await createPropertyAction(formData);

    if (result.success) {
      toast.success("Property created successfully!");
      form.reset();
    } else {
      const errorMsg =
        typeof result.error === "string"
          ? result.error
          : "An unknown error occurred.";
      toast.error(`Error: ${errorMsg}`);
      console.error("Form submission error:", result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Luxury 2-Bedroom Apartment in Downtown"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Price Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (AED)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2000000"
                    value={field.value || ""}
                    onChange={(e) => {
                      // valueAsNumber returns NaN for empty string
                      // We default to 0 to keep it a number
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Property Type Field */}
          <FormField
            control={form.control}
            name="propertyTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select
                  onValueChange={(value: string) =>
                    field.onChange(parseInt(value, 10))
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bedrooms Field */}
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bathrooms Field */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Furnishing Field */}
          <FormField
            control={form.control}
            name="furnishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Furnishing Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select furnishing status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(FurnishingStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) +
                          status.slice(1).toLowerCase().replace("_", "-")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dubai Marina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the property..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ================================================ */}
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
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
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
                      sizes="450px"
                      // sizes="128px"
                      className="object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setGalleryImages(
                        galleryImages.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                    // className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
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
        {/* ================================================ */}

        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting
            ? "Creating Property..."
            : "Create Property"}
        </Button>
      </form>
    </Form>
  );
}
