// src/modules/property/advertise/stores/useLocationStore.ts
import { create } from "zustand";
import { getCountries, getCitiesByCountry } from "@/lib/locationService";

interface LocationState {
  countries: { name: string; isoCode: string }[];
  cities: Record<string, { name: string }[]>; // cache cities per country
  loadCountries: () => void;
  loadCities: (countryCode: string) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  countries: [],
  cities: {},

  loadCountries: () => {
    const countries = getCountries();
    set({ countries });
  },

  loadCities: (countryCode) => {
    const existing = get().cities[countryCode];
    if (existing) return; // already cached

    const cities = getCitiesByCountry(countryCode);
    set((state) => ({
      cities: { ...state.cities, [countryCode]: cities },
    }));
  },
}));
