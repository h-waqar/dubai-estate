"use client";

import React, { useEffect } from "react";
import ProjectAdvertiseWizard from "@/modules/project/components/advertise/ProjectAdvertiseWizard";
import { useProjectAdvertiseStore } from "@/modules/project/stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "@/modules/project/stores/useProjectStepStore";

interface ProjectEditWrapperProps {
    project: any;
    mediaUsages: any[];
    developers: any[];
    amenities: any[];
}

export default function ProjectEditWrapper({
    project,
    mediaUsages,
    developers,
    amenities,
}: ProjectEditWrapperProps) {
    const updateStore = useProjectAdvertiseStore((state) => state.update);
    const resetSteps = useProjectStepStore((state) => state.reset);

    useEffect(() => {
        // Hydrate store with project data
        const logo = mediaUsages.find((m) => m.role === "LOGO")?.media;
        const coverImage = mediaUsages.find((m) => m.role === "COVER")?.media;
        const gallery = mediaUsages
            .filter((m) => m.role === "GALLERY")
            .map((m) => m.media);

        const aboutFeatures = project.features
            ?.filter((f: any) => f.category === "ABOUT_FEATURE")
            .map((f: any) => ({
                id: f.id.toString(), // Store uses string IDs for temp items
                name: f.name,
                icon: f.icon,
                imageUrl: f.imageUrl,
                order: f.order,
            })) || [];

        // Currently we don't strictly separate "Amenity Features" (ProjectFeature type="AMENITY") 
        // vs "Amenities" (ProjectAmenity relation). 
        // The wizard StepSixAmenities uses the `amenities` relation mainly.
        // If you used "Amenity Features" in Step 2.5, they are in aboutFeatures array in store? 
        // No, store has `aboutFeatures`.

        updateStore({
            projectType: project.projectType,
            name: project.name,
            developerId: project.developerId,
            community: project.community || "",
            location: project.location,
            address: project.address || "",
            latitude: project.latitude || undefined,
            longitude: project.longitude || undefined,
            locationDescription: project.locationDescription || "",

            tagline: project.tagline || "",
            description: project.description || "",
            aboutContent: project.aboutContent || "",
            highlights: [], // Schema doesn't have highlights array? It was in validator but maybe not in Prisma model? 
            // Checked schema: Project model doesn't have `highlights` array field. It might be computed or missing?
            // Validator had `highlights: z.array(z.string())`.
            // Let's leave empty if not in project object.

            aboutFeatures: aboutFeatures,

            priceFrom: Number(project.priceFrom) || undefined,
            currency: project.currency,
            paymentPlanSummary: project.paymentPlanSummary || "",

            handoverDate: project.handoverDate ? new Date(project.handoverDate) : undefined,
            announcementDate: project.announcementDate ? new Date(project.announcementDate) : undefined,
            bookingOpenedDate: project.bookingOpenedDate ? new Date(project.bookingOpenedDate) : undefined,
            constructionStartDate: project.constructionStartDate ? new Date(project.constructionStartDate) : undefined,

            progressPercentage: project.progressPercentage || undefined,
            progressStatus: project.progressStatus || undefined,
            progressImage: project.progressImage ? { url: project.progressImage, id: -1, title: null } as any : undefined, // Quick fix for progressImage being string vs Media

            // Relations
            floorplans: project.floorplans.map((fp: any) => ({
                id: fp.id.toString(),
                unitType: fp.unitType,
                unitName: fp.unitName,
                bedrooms: fp.bedrooms,
                bathrooms: fp.bathrooms,
                size: fp.size,
                sizeUnit: fp.sizeUnit,
                imageUrl: fp.imageUrl,
                pdfUrl: fp.pdfUrl,
                featured: fp.featured
            })),

            paymentPlan: project.paymentPlan.map((pp: any) => ({
                id: pp.id.toString(),
                percentage: pp.percentage,
                description: pp.description,
                triggerEvent: pp.triggerEvent,
                order: pp.order
            })),

            nearbyAttractions: project.nearbyAttractions.map((na: any) => ({
                id: na.id.toString(),
                name: na.name,
                distance: na.distance,
                order: na.order
            })),

            faqs: project.faqs.map((f: any) => ({
                id: f.id.toString(),
                question: f.question,
                answer: f.answer,
                order: f.order
            })),

            amenityIds: project.amenities.map((a: any) => a.id),

            // Media
            logo: logo,
            coverImage: coverImage,
            gallery: gallery,
        });

        // Reset to first step
        resetSteps();

    }, [project, mediaUsages, updateStore, resetSteps]);

    return (
        <ProjectAdvertiseWizard
            developers={developers}
            amenities={amenities}
        />
    );
}
