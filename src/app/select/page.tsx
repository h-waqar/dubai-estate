"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface LocationModalProps {
  countries: { name: string; cities: string[] }[];
  onSelect: (country: string, city: string) => void;
}

export default function LocationModal({
  countries,
  onSelect,
}: LocationModalProps) {
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const availableCities =
    countries.find((c) => c.name === country)?.cities || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn btn-primary">Select Location</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Country & City</DialogTitle>
        </DialogHeader>

        {/* Country Select */}
        <Select
          value={country}
          onValueChange={(val) => {
            setCountry(val);
            setCity("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Select */}
        <Select value={city} onValueChange={setCity} disabled={!country}>
          <SelectTrigger>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {availableCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={() => onSelect(country, city)}
          disabled={!country || !city}
          className="mt-4 btn btn-primary w-full"
        >
          Confirm
        </button>
      </DialogContent>
    </Dialog>
  );
}
