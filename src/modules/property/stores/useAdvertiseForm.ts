import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Media } from "@/modules/media/types/media.types";

interface AdvertiseFormState {
  // Step 1: Basic
  propertyStatus: string;
  propertyTypeId: number | undefined;
  title: string;
  location: string;
  address: string;
  latitude: number | undefined;
  longitude: number | undefined;

  // Step 2: Description
  description: string;
  keywords: string[];
  features: string[];

  // Step 3: Details
  price: number | undefined;
  currency: string;
  bedrooms: number | undefined;
  bathrooms: number | undefined;
  propertySize: number | undefined;
  furnishing: "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";

  // Step 4: Media
  coverImage: Media | null;
  gallery: Media[];

  // Step 5: Account (for new users)
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  plan: string;

  // Step 6: Payment
  paymentMethod: string;
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;

  update: (data: Partial<AdvertiseFormState>) => void;
  reset: () => void;
}

export const useAdvertiseFormStore = create<AdvertiseFormState>()(
  persist(
    (set) => ({
      // Defaults
      propertyStatus: "sale",
      propertyTypeId: undefined,
      title: "",
      location: "",
      address: "",
      latitude: undefined,
      longitude: undefined,

      description: "",
      keywords: [],
      features: [],

      price: undefined,
      currency: "AED",
      bedrooms: undefined,
      bathrooms: undefined,
      propertySize: undefined,
      furnishing: "UNFURNISHED",

      coverImage: null,
      gallery: [],

      plan: "silver",
      paymentMethod: "card",

      update: (data) => set((state) => ({ ...state, ...data })),
      reset: () =>
        set({
          propertyStatus: "sale",
          propertyTypeId: undefined,
          title: "",
          location: "",
          address: "",
          latitude: undefined,
          longitude: undefined,
          description: "",
          keywords: [],
          features: [],
          price: undefined,
          currency: "AED",
          bedrooms: undefined,
          bathrooms: undefined,
          propertySize: undefined,
          furnishing: "UNFURNISHED",
          coverImage: null,
          gallery: [],
          plan: "silver",
          paymentMethod: "card",
          // Reset other fields as needed
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          billingAddress1: "",
          billingAddress2: "",
          billingCity: "",
          billingState: "",
          billingPostalCode: "",
        }),
    }),
    { name: "advertise-form-store" }
  )
);
