"use client";

import React from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createProjectAction } from "../../../actions/createProject.action";
import { useRouter } from "next/navigation";

export default function StepEightReview() {
    const store = useProjectAdvertiseStore();
    const { prev, next } = useProjectStepStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const formData = new FormData();

            // Add all form fields
            formData.append("projectType", store.projectType);
            formData.append("name", store.name);
            formData.append("developerId", store.developerId?.toString() || "");
            formData.append("community", store.community || "");
            formData.append("location", store.location);
            formData.append("address", store.address || "");
            formData.append("description", store.description || "");
            formData.append("tagline", store.tagline || "");
            formData.append("aboutContent", store.aboutContent || "");
            formData.append("locationDescription", store.locationDescription || "");
            formData.append("highlights", JSON.stringify(store.highlights));
            formData.append("aboutFeatures", JSON.stringify(store.aboutFeatures));
            formData.append("priceFrom", store.priceFrom?.toString() || "");
            formData.append("currency", store.currency);
            formData.append("paymentPlanSummary", store.paymentPlanSummary || "");
            formData.append("paymentPlan", JSON.stringify(store.paymentPlan));
            formData.append("floorplans", JSON.stringify(store.floorplans));
            // Send selectedAmenities as JSON (AmenityInput[])
            formData.append("selectedAmenities", JSON.stringify(store.selectedAmenities));
            // Also keep amenityIds for backward compatibility if needed, though we use name map now
            formData.append("amenityIds", JSON.stringify(store.selectedAmenities.map(a => a.id)));
            formData.append("nearbyAttractions", JSON.stringify(store.nearbyAttractions));
            formData.append("faqs", JSON.stringify(store.faqs));

            // Add media fields
            if (store.logo) {
                formData.append("logoId", store.logo.id.toString());
            }
            if (store.coverImage) {
                formData.append("coverImageId", store.coverImage.id.toString());
            }
            if (store.gallery.length > 0) {
                formData.append("galleryIds", JSON.stringify(store.gallery.map(img => img.id)));
            }

            if (store.handoverDate) {
                // Convert to Date object if it's a string (from date input)
                const handoverDate = store.handoverDate instanceof Date
                    ? store.handoverDate
                    : new Date(store.handoverDate);
                formData.append("handoverDate", handoverDate.toISOString());
            }

            const result = await createProjectAction(formData);

            if (result.success) {
                next(); // Go to success step
            } else {
                setError(result.error || "Failed to submit project");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                <h3 className="text-xl font-semibold mb-4">Review Your Project</h3>

                <div className="space-y-3 text-sm">
                    <div>
                        <strong>Project Name:</strong> {store.name}
                    </div>
                    <div>
                        <strong>Type:</strong> {store.projectType}
                    </div>
                    <div>
                        <strong>Location:</strong> {store.location}
                    </div>
                    <div>
                        <strong>Price From:</strong> AED {store.priceFrom?.toLocaleString() || "N/A"}
                    </div>
                    <div>
                        <strong>Floorplans:</strong> {store.floorplans.length} unit types
                    </div>
                    <div>
                        <strong>Amenities:</strong> {store.selectedAmenities.length} selected
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
                        {error}
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button onClick={prev} variant="outline">
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? "Submitting..." : "Submit Project"}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
