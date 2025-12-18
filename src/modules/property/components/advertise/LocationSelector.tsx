"use client";

import { useEffect, useState, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocationStore } from "@/stores/useLocationStore";
import { useAdvertiseFormStore } from "../../stores/useAdvertiseForm";
import { FieldWrapper, FormLabel } from "./FormComponents";

export default function LocationSelector() {
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const hasInitialized = useRef(false);

  const { countries, cities, loadCountries, loadCities } = useLocationStore();
  const { update, location } = useAdvertiseFormStore();

  // Load countries on mount
  useEffect(() => {
    console.log("Load Countries Effect");
    loadCountries();
  }, [loadCountries]);

  // 1. Initialize from store location immediately (don't wait for countries)
  useEffect(() => {
    console.log("Init Effect running. Location:", location, "HasInit:", hasInitialized.current);
    if (!hasInitialized.current && location) {
      // Robust split
      const parts = location.split(",").map((p) => p.trim());
      console.log("Split parts:", parts);

      if (parts.length === 2) {
        const [cityPart, countryPart] = parts;
        setCountry(countryPart);
        setCity(cityPart);
      } else if (parts.length === 1) {
        setCountry(parts[0]);
      }
      hasInitialized.current = true;
    }
  }, [location]);

  // 2. React to country change (or countries loading) to fetch cities
  useEffect(() => {
    if (country && countries.length > 0) {
      const countryObj = countries.find((c) => c.name === country);
      if (countryObj) {
        loadCities(countryObj.isoCode);
      }
    }
  }, [country, countries, loadCities]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity("");
    update({ location: value });
    // loadCities will be triggered by variable dependency effect
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (country) {
      update({ location: `${value}, ${country}` });
    }
  };

  const selectedCountry = countries.find((c) => c.name === country);
  const cityList =
    selectedCountry && cities[selectedCountry.isoCode]
      ? cities[selectedCountry.isoCode]
      : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FieldWrapper>
        <FormLabel required>Select Country</FormLabel>
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="min-h-12 w-full border-input bg-background hover:bg-accent/50 transition-colors">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {/* Fallback for mismatching/loading country */}
            {country && !countries.some((c) => c.name === country) && (
              <SelectItem value={country}>{country}</SelectItem>
            )}
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldWrapper>

      <FieldWrapper>
        <FormLabel required>Select City</FormLabel>
        <Select
          value={city}
          onValueChange={handleCityChange}
          disabled={!country}
        >
          <SelectTrigger className="min-h-12 w-full border-input bg-background hover:bg-accent/50 transition-colors">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {/* Fallback for mismatching/loading city */}
            {city && !cityList.some((c) => c.name === city) && (
              <SelectItem value={city}>{city}</SelectItem>
            )}
            {cityList.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldWrapper>
    </div>
  );
}
