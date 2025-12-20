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
    pdfUrl?: string;
    featured?: boolean;
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

// FAQ for step 2
export interface FAQInput {
    id?: string;
    question: string;
    answer: string;
    order: number;
}

interface ProjectAdvertiseFormState {
    // Step 1: Basic Info
    projectType: "FUTURE" | "CURRENT" | "PAST";
    name: string;
    developerId: number | undefined;
    community: string;
    location: string;
    address: string;
    latitude: number | undefined;
    longitude: number | undefined;

    // Step 2: Description & Details
    description: string;
    highlights: string[]; // Array of highlight points
    nearbyAttractions: NearbyAttractionInput[];
    faqs: FAQInput[];

    // Step 3: Pricing & Payment Plan
    priceFrom: number | undefined;
    currency: string;
    paymentPlanSummary: string; // e.g., "30/70"
    paymentPlan: PaymentStageInput[];
    handoverDate: Date | undefined;

    // Additional Timeline Dates
    announcementDate: Date | undefined;
    bookingOpenedDate: Date | undefined;
    constructionStartDate: Date | undefined;

    // Step 4: Media (Logo, Cover, Gallery)
    logo: Media | null;
    coverImage: Media | null;
    gallery: Media[];

    // Step 5: Floorplans
    floorplans: FloorplanInput[];

    // Step 6: Amenities
    selectedAmenities: number[]; // Array of amenity IDs

    // Step 7: Account (if new user)
    username?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;

    // Methods
    update: (data: Partial<ProjectAdvertiseFormState>) => void;
    reset: () => void;
    addFloorplan: (floorplan: FloorplanInput) => void;
    removeFloorplan: (id: string) => void;
    updateFloorplan: (id: string, data: Partial<FloorplanInput>) => void;
    addPaymentStage: (stage: PaymentStageInput) => void;
    removePaymentStage: (id: string) => void;
    addNearbyAttraction: (attraction: NearbyAttractionInput) => void;
    removeNearbyAttraction: (id: string) => void;
    addFAQ: (faq: FAQInput) => void;
    removeFAQ: (id: string) => void;
}

const initialState = {
    projectType: "CURRENT" as const,
    name: "",
    developerId: undefined,
    community: "",
    location: "",
    address: "",
    latitude: undefined,
    longitude: undefined,

    description: "",
    highlights: [],
    nearbyAttractions: [],
    faqs: [],

    priceFrom: undefined,
    currency: "AED",
    paymentPlanSummary: "",
    paymentPlan: [],
    handoverDate: undefined,
    announcementDate: undefined,
    bookingOpenedDate: undefined,
    constructionStartDate: undefined,

    logo: null,
    coverImage: null,
    gallery: [],

    floorplans: [],
    selectedAmenities: [],

    username: "",
    email: "",
    password: "",
    repeatPassword: "",
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
                    faqs: [...state.faqs, { ...faq, id: crypto.randomUUID() }],
                })),

            removeFAQ: (id) =>
                set((state) => ({
                    faqs: state.faqs.filter((faq) => faq.id !== id),
                })),
        }),
        { name: "project-advertise-store" }
    )
);
