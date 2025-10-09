// src\stores\usePostStore.ts


import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PostFormData } from "@/types/post";

interface PostStore {
  post: PostFormData;
  loading: boolean;
  error: string | null;
  success: string | null;
  lastSavedAt?: string;
  saving: boolean;
  autoSaveEnabled: boolean;

  // Actions
  setPost: (data: Partial<PostFormData>) => void;
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

const initialState: PostFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  tags: [],
  categoryId: "",
  coverImage: "",
  published: false,
};

export const usePostStore = create<PostStore>()(
  persist(
    (set, _get) => ({
      post: initialState,
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
          post: initialState,
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
