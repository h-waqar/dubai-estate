import { z } from "zod";

// Enums matching Prisma schema
export const projectTypeEnum = z.enum(["FUTURE", "CURRENT", "PAST"]);
export const unitTypeEnum = z.enum([
    "STUDIO",
    "ONE_BEDROOM",
    "ONE_BEDROOM_STUDY",
    "TWO_BEDROOM",
    "TWO_BEDROOM_STUDY",
    "THREE_BEDROOM",
    "THREE_BEDROOM_MAID",
    "FOUR_BEDROOM",
    "PENTHOUSE",
    "VILLA",
    "TOWNHOUSE",
]);

// Floorplan validator
export const floorplanValidator = z.object({
    unitType: unitTypeEnum,
    unitName: z.string().optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    size: z.number().positive().optional(),
    sizeUnit: z.string().default("sqft"),
    imageUrl: z.string().optional(),
    pdfUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
});

// Payment plan stage validator
export const paymentStageValidator = z.object({
    percentage: z.number().int().min(0).max(100),
    description: z.string().min(1),
    triggerEvent: z.string().optional(),
    order: z.number().int().default(0),
});

// Nearby attraction validator
export const nearbyAttractionValidator = z.object({
    name: z.string().min(1),
    distance: z.string().min(1), // e.g., "5 Minutes", "10 km"
    order: z.number().int().default(0),
});

// FAQ validator
export const faqValidator = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    order: z.number().int().default(0),
});

// About Feature validator
export const aboutFeatureValidator = z.object({
    name: z.string().min(1),
    icon: z.string().optional(), // Make icon optional as we might have imageUrl
    imageUrl: z.string().optional(),
    order: z.number().int().default(0),
});

// Main project creation validator
export const createProjectValidator = z.object({
    // Basic Info
    projectType: projectTypeEnum.default("CURRENT"),
    name: z.string().min(1, "Project name is required"),
    developerId: z.number().int().positive("Developer is required"),
    community: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // Data for Progress Section
    progressPercentage: z.number().int().min(0).max(100).optional(),
    progressStatus: z.string().optional(),
    progressImage: z.string().optional(),

    // Description
    description: z.string().optional(),
    tagline: z.string().optional(),
    aboutContent: z.string().optional(),
    locationDescription: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    aboutFeatures: z.array(aboutFeatureValidator).default([]),
    amenityFeatures: z.array(aboutFeatureValidator).default([]), // Reusing aboutFeatureValidator as struct is same

    // Pricing
    priceFrom: z.number().positive().optional(),
    currency: z.string().default("AED"),
    paymentPlanSummary: z.string().optional(), // e.g., "30/70"

    // Dates
    handoverDate: z.coerce.date().optional(),
    announcementDate: z.coerce.date().optional(),
    bookingOpenedDate: z.coerce.date().optional(),
    constructionStartDate: z.coerce.date().optional(),

    // Media (will be MediaUsage IDs)
    logoId: z.number().int().positive().optional(),
    coverImageId: z.number().int().positive().optional(),
    galleryIds: z.array(z.number().int().positive()).default([]),

    // Relations
    floorplans: z.array(floorplanValidator).default([]),
    paymentPlan: z.array(paymentStageValidator).default([]),
    nearbyAttractions: z.array(nearbyAttractionValidator).default([]),
    faqs: z.array(faqValidator).default([]),
    amenityIds: z.array(z.number().int().positive()).default([]),
});

// Update validator (all fields optional except id)
export const updateProjectValidator = createProjectValidator.partial().extend({
    id: z.number().int().positive(),
});

// Filter/search validator
export const projectFilterValidator = z.object({
    projectType: projectTypeEnum.optional(),
    developerId: z.number().int().positive().optional(),
    status: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "DECLINED", "ARCHIVED"]).optional(),
    search: z.string().optional(),
    published: z.boolean().optional(),
    createdById: z.number().int().positive().optional(),
});

// Export types
export type CreateProjectInput = z.infer<typeof createProjectValidator>;
export type UpdateProjectInput = z.infer<typeof updateProjectValidator>;
export type ProjectFilterInput = z.infer<typeof projectFilterValidator>;
export type FloorplanInput = z.infer<typeof floorplanValidator>;
export type PaymentStageInput = z.infer<typeof paymentStageValidator>;
export type NearbyAttractionInput = z.infer<typeof nearbyAttractionValidator>;
export type FAQInput = z.infer<typeof faqValidator>;
