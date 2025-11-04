// src\modules\media\stores\store.ts
import { create } from "zustand";
import { Media } from "../types/media.types";

interface MediaState {
  mediaList: Media[];
  loading: boolean;
  error: string | null;

  setMediaList: (media: Media[]) => void;
  addMedia: (media: Media) => void;
  removeMedia: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  mediaList: [],
  loading: false,
  error: null,

  setMediaList: (media) => set({ mediaList: media }),
  addMedia: (media) =>
    set((state) => ({ mediaList: [media, ...state.mediaList] })),
  removeMedia: (id) =>
    set((state) => ({ mediaList: state.mediaList.filter((m) => m.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
