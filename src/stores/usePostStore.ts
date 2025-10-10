// src/stores/usePostStore.ts


import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type PostFormData, // Keep this import for the default values type
  type PartialPostFormData,
  defaultPostFormData,
} from "@/types/post";

interface PostStore {
  post: PartialPostFormData;
  loading: boolean;
  error: string | null;
  success: string | null;
  lastSavedAt?: string;
  saving: boolean;
  autoSaveEnabled: boolean;

  // Actions
  setPost: (data: PartialPostFormData) => void;
  resetPost: () => void;
  setLoading: (state: boolean) => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;

  // Extra control methods
  markSaved: () => void;
  toggleAutoSave: (enabled: boolean) => void;
  startSaving: () => void;
  stopSaving: () => void;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, _get) => ({
      post: defaultPostFormData,
      loading: false,
      error: null,
      success: null,
      saving: false,
      autoSaveEnabled: true,
      lastSavedAt: undefined,

      setPost: (data) =>
        set((state) => ({
          post: { ...state.post, ...data },
        })),

      resetPost: () =>
        set({
          post: defaultPostFormData,
          loading: false,
          error: null,
          success: null,
          saving: false,
          autoSaveEnabled: true,
          lastSavedAt: undefined,
        }),

      setLoading: (state) => set({ loading: state }),
      setError: (msg) => set({ error: msg }),
      setSuccess: (msg) => set({ success: msg }),

      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
      toggleAutoSave: (enabled) => set({ autoSaveEnabled: enabled }),
      startSaving: () => set({ saving: true }),
      stopSaving: () => set({ saving: false }),
    }),
    {
      name: "post-storage",
      partialize: (state) => ({
        post: state.post,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
