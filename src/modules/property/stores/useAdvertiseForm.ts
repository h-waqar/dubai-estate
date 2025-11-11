// src/modules/property/advertise/store/useAdvertiseFormStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdvertiseFormState {
  // Step 1: Basic
  title: string;
  propertyType: string;
  // Step 2: Description
  description: string;
  keywords: string[];
  features: string[];
  // Step 3+: more fields later
  // ...
  update: (data: Partial<AdvertiseFormState>) => void;
  reset: () => void;
}

export const useAdvertiseFormStore = create<AdvertiseFormState>()(
  persist(
    (set) => ({
      title: "",
      propertyType: "",
      description: "",
      keywords: [],
      features: [],
      update: (data) => set((state) => ({ ...state, ...data })),
      reset: () =>
        set({
          title: "",
          propertyType: "",
          description: "",
          keywords: [],
          features: [],
        }),
    }),
    { name: "advertise-form-store" }
  )
);
