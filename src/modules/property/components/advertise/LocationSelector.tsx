"use client";

import { useEffect, useState } from "react";
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
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const { countries, cities, loadCountries, loadCities } = useLocationStore();
  const { update, location } = useAdvertiseFormStore();

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // Initialize from store
  useEffect(() => {
    if (location) {
      const parts = location.split(", ");
      if (parts.length === 2) {
        setCity(parts[0]);
        setCountry(parts[1]);
      } else if (parts.length === 1) {
        setCountry(parts[0]); 
      }
    }
  }, [location]);

  // Load cities when country changes
  useEffect(() => {
    if (country) {
      const countryObj = countries.find((c) => c.name === country);
      if (countryObj) loadCities(countryObj.isoCode);
    }
  }, [country, countries, loadCities]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity(null); // Reset city when country changes
    update({ location: value }); // Update store with just country initially
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
        <Select value={country || ""} onValueChange={handleCountryChange}>
          <SelectTrigger className="h-12 border-input bg-background hover:bg-accent/50 transition-colors">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
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
          value={city || ""} 
          onValueChange={handleCityChange}
          disabled={!country}
        >
          <SelectTrigger className="h-12 border-input bg-background hover:bg-accent/50 transition-colors">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
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
