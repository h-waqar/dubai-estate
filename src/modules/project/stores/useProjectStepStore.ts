import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Step {
    title: string;
    description: string;
}

interface ProjectStepState {
    steps: Step[];
    step: number;
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
    reset: () => void;
}

export const useProjectStepStore = create<ProjectStepState>()(
    persist(
        (set, get) => ({
            steps: [
                { title: "Basic Info", description: "Project details and location" },
                { title: "Description", description: "About and highlights" },
                { title: "Pricing", description: "Payment plan and pricing" },
                { title: "Media", description: "Logo, cover, and gallery" },
                { title: "Floorplans", description: "Unit types and layouts" },
                { title: "Amenities", description: "Features and facilities" },
                { title: "Account", description: "User registration" },
                { title: "Review", description: "Review and submit" },
                { title: "Success", description: "Submission complete" },
            ],
            step: 0,
            next: () =>
                set({ step: Math.min(get().step + 1, get().steps.length - 1) }),
            prev: () => set({ step: Math.max(get().step - 1, 0) }),
            goTo: (index) => set({ step: index }),
            reset: () => set({ step: 0 }),
        }),
        { name: "project-advertise-step" }
    )
);
