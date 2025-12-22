import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Media } from "@/modules/media/types/media.types";

// Floorplan type for step 5
export interface FloorplanInput {
    id?: string; // Temp ID for React keys
    unitType: string;
    unitName?: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    sizeUnit?: string;
    imageUrl?: string;
    image?: Media; // Uploaded floorplan image
    pdfUrl?: string;
    featured?: boolean;
}

// About Feature for About section
export interface AboutFeatureInput {
    id?: string;
    name: string;
    icon: string; // Lucide icon name
    customIcon?: Media; // Custom uploaded icon
    order: number;
}

// Payment plan stage for step 3
export interface PaymentStageInput {
    id?: string;
    percentage: number;
    description: string;
    triggerEvent?: string;
    order: number;
}

// Nearby attraction for step 2
export interface NearbyAttractionInput {
    id?: string;
    name: string;
    distance: string;
    order: number;
}

export interface AmenityInput {
    id: number;
    name: string;
    image?: Media;
}

// FAQ for step 2
export interface FAQInput {
    id?: string;
    question: string;
    answer: string;
    order: number;
}

interface ProjectAdvertiseFormState {
    id?: number; // For editing
    // Step 1: Basic Info
    projectType: "FUTURE" | "CURRENT" | "PAST";
    name: string;
    developerId: number | undefined;
    community: string;
    location: string;
    address: string;
    // Location Details
    latitude?: number;
    longitude?: number;
    locationDescription?: string;

    // Dates
    handoverDate?: Date;
    announcementDate?: Date;
    bookingOpenedDate?: Date;
    constructionStartDate?: Date;

    // Progress
    progressPercentage?: number;
    progressStatus?: string;
    progressImage?: Media;

    // Details/Media
    highlights: string[];
    tagline: string;
    description: string;
    aboutContent: string;
    aboutFeatures: AboutFeatureInput[];

    // Media IDs
    logo?: Media;
    coverImage?: Media;
    gallery: Media[];

    // Payment Plan
    priceFrom: number | undefined;
    currency: string;
    paymentPlanSummary?: string;
    paymentPlan: PaymentStageInput[];

    // Nearby Attractions
    nearbyAttractions: NearbyAttractionInput[];

    // Selected Amenities (Step 5/6)
    selectedAmenities: AmenityInput[];
    amenityIds: number[];

    // FAQs
    faqs: FAQInput[];

    // Step 5: Floorplans
    floorplans: FloorplanInput[];

    // Step 7: Account (if new user)
    username?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;

    // Step 9: Payment
    paymentMethod?: "card" | "paypal" | "pay-later";
    cardholderName?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    billingAddress1?: string;
    billingAddress2?: string;
    billingCity?: string;
    billingState?: string;
    billingPostalCode?: string;

    // Methods
    update: (data: Partial<ProjectAdvertiseFormState>) => void;
    reset: () => void;
    addFloorplan: (floorplan: FloorplanInput) => void;
    removeFloorplan: (id: string) => void;
    updateFloorplan: (id: string, data: Partial<FloorplanInput>) => void;
    addPaymentStage: (stage: PaymentStageInput) => void;
    removePaymentStage: (id: string) => void;
    toggleAmenity: (amenity: AmenityInput) => void;
    updateAmenityImage: (id: number, image: Media) => void;
    addNearbyAttraction: (attraction: NearbyAttractionInput) => void;
    removeNearbyAttraction: (id: string) => void;
    addFAQ: (faq: FAQInput) => void;
    removeFAQ: (id: string) => void;
    addAboutFeature: (feature: AboutFeatureInput) => void;
    removeAboutFeature: (id: string) => void;
}

const initialState = {
    id: undefined,
    projectType: "CURRENT" as const,
    name: "",
    developerId: undefined,
    community: "",
    location: "",
    address: "",
    latitude: undefined,
    longitude: undefined,

    description: "",
    tagline: "",
    aboutContent: "",
    highlights: [],
    aboutFeatures: [],
    nearbyAttractions: [],
    faqs: [],

    priceFrom: undefined,
    currency: "AED",
    paymentPlanSummary: undefined,
    paymentPlan: [],
    handoverDate: undefined,
    announcementDate: undefined,
    bookingOpenedDate: undefined,
    constructionStartDate: undefined,

    logo: undefined,
    coverImage: undefined,
    gallery: [],

    floorplans: [],
    amenityIds: [],
    selectedAmenities: [],

    locationDescription: "",

    username: "",
    email: "",
    password: "",
    phone: "",
    userType: "DEVELOPER" as const,
    repeatPassword: "",
    paymentMethod: "card" as const,
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
};

export const useProjectAdvertiseStore = create<ProjectAdvertiseFormState>()(
    persist(
        (set, get) => ({
            ...initialState,

            update: (data) => set((state) => ({ ...state, ...data })),

            reset: () => set(initialState),

            // Floorplan methods
            addFloorplan: (floorplan) =>
                set((state) => ({
                    floorplans: [...state.floorplans, { ...floorplan, id: crypto.randomUUID() }],
                })),

            removeFloorplan: (id) =>
                set((state) => ({
                    floorplans: state.floorplans.filter((fp) => fp.id !== id),
                })),

            updateFloorplan: (id, data) =>
                set((state) => ({
                    floorplans: state.floorplans.map((fp) =>
                        fp.id === id ? { ...fp, ...data } : fp
                    ),
                })),

            // Payment stage methods
            addPaymentStage: (stage) =>
                set((state) => ({
                    paymentPlan: [...state.paymentPlan, { ...stage, id: crypto.randomUUID() }],
                })),

            removePaymentStage: (id) =>
                set((state) => ({
                    paymentPlan: state.paymentPlan.filter((ps) => ps.id !== id),
                })),

            // Nearby attraction methods
            addNearbyAttraction: (attraction) =>
                set((state) => ({
                    nearbyAttractions: [
                        ...state.nearbyAttractions,
                        { ...attraction, id: crypto.randomUUID() },
                    ],
                })),

            removeNearbyAttraction: (id) =>
                set((state) => ({
                    nearbyAttractions: state.nearbyAttractions.filter((na) => na.id !== id),
                })),

            // FAQ methods
            addFAQ: (faq) =>
                set((state) => ({
                    faqs: [...state.faqs, { ...faq, id: Math.random().toString(36).substr(2, 9) }],
                })),

            removeFAQ: (id) =>
                set((state) => ({
                    faqs: state.faqs.filter((f) => f.id !== id),
                })),

            // About Feature methods
            addAboutFeature: (feature) =>
                set((state) => ({
                    aboutFeatures: [...state.aboutFeatures, { ...feature, id: Math.random().toString(36).substr(2, 9) }],
                })),

            removeAboutFeature: (id) =>
                set((state) => ({
                    aboutFeatures: state.aboutFeatures.filter((f) => f.id !== id),
                })),

            // Amenity Actions
            toggleAmenity: (amenity) =>
                set((state) => {
                    const exists = state.selectedAmenities.find((a) => a.id === amenity.id);
                    if (exists) {
                        return {
                            selectedAmenities: state.selectedAmenities.filter((a) => a.id !== amenity.id),
                        };
                    }
                    return {
                        selectedAmenities: [...state.selectedAmenities, amenity],
                    };
                }),
            updateAmenityImage: (id, image) =>
                set((state) => ({
                    selectedAmenities: state.selectedAmenities.map((a) =>
                        a.id === id ? { ...a, image } : a
                    ),
                })),
        }),
        { name: "project-advertise-store" }
    )
);
