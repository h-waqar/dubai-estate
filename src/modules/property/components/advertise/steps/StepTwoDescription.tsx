"use client";

import { useState } from "react";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AVAILABLE_FEATURES = [
  "Pet Friendly",
  "Good Mobile Coverage",
  "Nearby Public Transport",
  "24/7 Building Security Staff",
  "Meeting Rooms",
  "Large Public Spaces",
  "Bike Storage",
  "Nearby Shops & Restaurants",
  "Car Park",
  "Swimming Pool",
  "Fitness Center/Gym",
  "Modern Fittings",
  "Wireless Internet",
  "Walk-in Closets",
  "Stunning Views",
  "Dishwasher",
  "Hardwood Floors",
  "Patio/Balcony",
  "Furniture",
  "Washer/Dryer Hookups",
  "Air Conditioning",
];

export default function StepDescription() {
  const { next, prev } = useStepStore();
  const { description, keywords, features, update } = useAdvertiseFormStore();

  const [tempKeyword, setTempKeyword] = useState("");

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tempKeyword.trim()) {
      e.preventDefault();
      const newKeyword = tempKeyword.trim();
      if (!keywords.includes(newKeyword)) {
        update({ keywords: [...keywords, newKeyword] });
      }
      setTempKeyword("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    update({ keywords: keywords.filter((k) => k !== kw) });
  };

  const toggleFeature = (feature: string) => {
    if (features.includes(feature)) {
      update({ features: features.filter((f) => f !== feature) });
    } else {
      update({ features: [...features, feature] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        📝 Add a Description
      </h2>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Property Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => update({ description: e.target.value })}
          rows={6}
          placeholder="Describe your property in detail..."
          className="resize-none"
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium mb-2">Keywords</label>
        <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-12">
          {keywords.map((kw) => (
            <Badge
              key={kw}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {kw}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                // className="text-muted-foreground hover:text-foreground"
                className="text-red-400 hover:text-red-600 scale-200 cursor-pointer -mt-1"
              >
                ×
              </button>
            </Badge>
          ))}
          <Input
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
            onKeyDown={handleAddKeyword}
            placeholder="Type and press Enter"
            className="border-0 shadow-none focus-visible:ring-0 w-auto flex-1 min-w-[150px]"
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="font-medium mb-2">Select Features</h3>
        <div className="flex flex-wrap gap-3 select-none">
          {AVAILABLE_FEATURES.map((feature) => (
            <label
              key={feature}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition",
                features.includes(feature)
                  ? "bg-primary/10 border-primary text-primary"
                  : "hover:bg-muted border-border"
              )}
            >
              <input
                type="checkbox"
                checked={features.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="accent-primary"
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 gap-4">
        <Button variant="outline" onClick={prev}>
          Back
        </Button>
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  );
}
