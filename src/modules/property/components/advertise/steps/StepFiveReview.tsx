"use client";

import { useState } from "react";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import { createPropertyAction } from "../../../actions/createProperty";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepFiveReviewProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

function StepFiveReview({ propertyTypes, serverData }: StepFiveReviewProps) {
  const { next, prev } = useStepStore();
  const { 
    title,
    propertyTypeId,
    description,
    features,
    price,
    bedrooms,
    bathrooms,
    furnishing,
    developerId,
    proposedDeveloperName,
    listingType,
    coverImage,
    gallery,
    location,
    latitude,
    longitude,
    reset,
  } = useAdvertiseFormStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price?.toString() || "0");

      if (!propertyTypeId || !propertyTypes.some(t => t.id === propertyTypeId)) {
        toast.error("Invalid Property Type.");
        return;
      }
      formData.append("propertyTypeId", propertyTypeId.toString());
      formData.append("bedrooms", bedrooms?.toString() || "0");
      formData.append("bathrooms", bathrooms?.toString() || "0");

      formData.append("location", location || "Dubai");
      if (latitude) formData.append("latitude", latitude.toString());
      if (longitude) formData.append("longitude", longitude.toString());

      // Use STORED listingType, fallback to SALE
      formData.append("listingType", listingType || "SALE");

      formData.append("furnishing", furnishing || "UNFURNISHED");
      formData.append("description", description || "");

      if (features && features.length > 0) {
        const availableFeatures = serverData.features || [];
        features.forEach((featureName) => {
          const name = typeof featureName === 'string' ? featureName : (featureName as any).name;
          const featureObj = availableFeatures.find(f => f.name === name);
          if (featureObj) {
            formData.append("features[]", featureObj.id.toString());
          }
        });
      }

      if (coverImage) {
        formData.append("coverImage", coverImage.id.toString());
      }

      gallery.forEach((img) => {
        formData.append("gallery[]", img.id.toString());
      });

      if (developerId) formData.append("developerId", developerId.toString());
      if (proposedDeveloperName) formData.append("proposedDeveloperName", proposedDeveloperName);

      const result = await createPropertyAction(formData);

      if (result.success) {
        toast.success("Property created successfully!");
        reset(); 
        next(); // Go to Success Step
      } else {
        console.error(result.error);
        toast.error("Failed to create property: " + JSON.stringify(result.error));
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold">Review & Submit</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                    <p className="text-lg font-medium">{title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                        <p>{Number(price).toLocaleString()} AED</p>
                    </div>
                     <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>{location}</p>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                        <p>{propertyTypes.find(t => t.id === propertyTypeId)?.name}</p>
                    </div>
                     <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Listing Type</h3>
                        <p>{listingType}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                    By clicking "Publish Property", your listing will be submitted for review.
                    It will consume 1 listing from your active plan quota.
                </p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border">
             <Button variant="ghost" onClick={prev}>Back</Button>
             <Button onClick={onSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Publish Property
             </Button>
        </div>
    </div>
  );
}
export default StepFiveReview;
