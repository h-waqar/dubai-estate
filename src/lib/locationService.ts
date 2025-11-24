// src/lib/locationService.ts
import { Country, State, City } from "country-state-city";

export const getCountries = () =>
  Country.getAllCountries()
    .filter((c) => c.name === "United Arab Emirates")
    .map((c) => ({
      name: c.name,
      isoCode: c.isoCode,
    }));

export const getCitiesByCountry = (countryCode: string) =>
  City.getCitiesOfCountry(countryCode)?.map((city) => ({
    name: city.name,
  })) ?? [];
