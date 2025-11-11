// src/modules/property/advertise/store/useAdvertiseStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Step {
  title: string;
  description: string;
}

interface AdvertiseState {
  steps: Step[];
  step: number;
  data: Record<string, any>;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  updateData: (partial: Record<string, any>) => void;
  reset: () => void;
}

export const useAdvertiseStore = create<AdvertiseState>()(
  persist(
    (set, get) => ({
      steps: [
        { title: "Create", description: "Property title and type" },
        { title: "Description", description: "Address and map" },
        { title: "Details", description: "Features and pricing" },
        { title: "Media", description: "Images and gallery" },
        { title: "Account", description: "Confirm & submit" },
        { title: "Payment", description: "Confirm & submit" },
        { title: "Success", description: "Confirm & submit" },
      ],
      step: 0,
      data: {},
      next: () =>
        set({ step: Math.min(get().step + 1, get().steps.length - 1) }),
      prev: () => set({ step: Math.max(get().step - 1, 0) }),
      goTo: (index) => set({ step: index }),
      updateData: (partial) => set({ data: { ...get().data, ...partial } }),
      reset: () => set({ step: 0, data: {} }),
    }),
    { name: "advertise-property" }
  )
);
