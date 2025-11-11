"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Globe, MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationStore } from "@/stores/useLocationStore";

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const [tempCountry, setTempCountry] = useState<string | null>(null);
  const [tempCity, setTempCity] = useState<string | null>(null);

  const { countries, cities, loadCountries, loadCities } = useLocationStore();

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (tempCountry) {
      const countryObj = countries.find((c) => c.name === tempCountry);
      if (countryObj) loadCities(countryObj.isoCode);
    }
  }, [tempCountry]);

  const handleSave = () => {
    setCountry(tempCountry);
    setCity(tempCity);
    setOpen(false);
  };

  const openModal = () => setOpen(true);

  const selectedCountry = countries.find((c) => c.name === tempCountry);
  const cityList =
    selectedCountry && cities[selectedCountry.isoCode]
      ? cities[selectedCountry.isoCode]
      : [];

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Select Location <span className="text-red-500">*</span>
      </label>

      <div className="grid sm:grid-cols-3 gap-3">
        <LocationCard
          icon={<Globe className="w-6 h-6" />}
          label={country || "Select Country"}
          onClick={openModal}
        />
        <LocationCard
          icon={<MapPin className="w-6 h-6" />}
          label={city || "Select City"}
          onClick={openModal}
        />
        <LocationCard
          icon={<Plus className="w-6 h-6" />}
          label={country && city ? "Change" : "Select"}
          dashed
          onClick={openModal}
        />
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Select
                value={tempCountry || ""}
                onValueChange={(value) => {
                  setTempCountry(value);
                  setTempCity(null);
                }}
              >
                <SelectTrigger className="w-full">
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
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Select
                value={tempCity || ""}
                onValueChange={setTempCity}
                disabled={!tempCountry}
              >
                <SelectTrigger className="w-full">
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!tempCountry || !tempCity}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LocationCard({
  icon,
  label,
  onClick,
  dashed,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  dashed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border transition-all h-28 sm:h-32 w-full py-6",
        dashed
          ? "border-dashed border-gray-400 hover:border-brand-500 hover:text-brand-600"
          : "border bg-muted/30 hover:bg-muted/50"
      )}
    >
      {icon}
      <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
  );
}
