"use client";

import { useState } from "react";
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

const COUNTRY_OPTIONS = [
  {
    code: "AE",
    name: "UAE",
    cities: ["Dubai", "Abu Dhabi", "Sharjah"],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    cities: ["Riyadh", "Jeddah", "Dammam"],
  },
];

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<string | null>("UAE");
  const [city, setCity] = useState<string | null>("Dubai");

  const [tempCountry, setTempCountry] = useState<string | null>(country);
  const [tempCity, setTempCity] = useState<string | null>(city);

  const handleSave = () => {
    setCountry(tempCountry);
    setCity(tempCity);
    setOpen(false);
  };

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.name === tempCountry);

  const openModal = () => setOpen(true);

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
                  setTempCity(null); // reset city when country changes
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.code} value={c.name}>
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
                  {selectedCountry?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
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
