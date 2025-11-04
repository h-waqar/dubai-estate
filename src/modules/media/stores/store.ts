// src/modules/media/stores/store.ts
import { create } from "zustand";

type MediaStore = {
  selected: number[];
  toggle: (id: number) => void;
};

export const useMediaStore = create<MediaStore>((set) => ({
  selected: [],
  toggle: (id) =>
    set((state) => ({
      selected: state.selected.includes(id)
        ? state.selected.filter((i) => i !== id)
        : [...state.selected, id],
    })),
}));
