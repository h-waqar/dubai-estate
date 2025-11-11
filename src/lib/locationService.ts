// src/lib/locationService.ts
import { Country, State, City } from "country-state-city";

export const getCountries = () =>
  Country.getAllCountries().map((c) => ({
    name: c.name,
    isoCode: c.isoCode,
  }));

export const getCitiesByCountry = (countryCode: string) =>
  City.getCitiesOfCountry(countryCode)?.map((city) => ({
    name: city.name,
  })) ?? [];
