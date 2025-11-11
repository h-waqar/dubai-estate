"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { Building2, Bed, Bath, Maximize2, DollarSign, Tag } from "lucide-react";

// Enhanced label component with better styling
const FormLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-semibold text-foreground mb-2.5 tracking-tight">
    {children}
    {required && (
      <span className="text-red-500 ml-1 font-bold" aria-label="required">
        *
      </span>
    )}
  </label>
);

// Field wrapper for consistent spacing and hover effects
const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative">{children}</div>
);

// Icon wrapper for input fields
const InputIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
    <Icon className="w-4 h-4" />
  </div>
);

function StepThreeDetails() {
  const { data, updateData, next, prev } = useStepStore();

  const handleNumberChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber;
      updateData({ [field]: isNaN(value) ? undefined : value });
    };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Enhanced Form Grid */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Property Details
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step 3 of 4 · Provide essential property information
            </p>
          </div>
        </div>

        {/* Price - Full Width Priority Field */}
        <FormLabel>Property Price</FormLabel>
        <div className="flex items-center gap-3 mt-2">
          <Select
            value={data.currency || "dollar"}
            onValueChange={(value) => updateData({ currency: value })}
          >
            <SelectTrigger className="shrink-0 min-h-12 border-input bg-background hover:bg-accent/50 transition-colors">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dollar">Dollar</SelectItem>
              <SelectItem value="aed">AED</SelectItem>
              <SelectItem value="eur">Euro</SelectItem>
              <SelectItem value="pkr">PKR</SelectItem>
            </SelectContent>
          </Select>
          <FieldWrapper>
            <InputIcon icon={DollarSign} />
            <Input
              type="number"
              value={data.price || ""}
              onChange={handleNumberChange("price")}
              placeholder="Enter price (e.g., 250000)"
              className="flex-1 h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
              min="0"
              step="1000"
            />
          </FieldWrapper>
        </div>

        {/* Property Status */}
        <FieldWrapper>
          <FormLabel>Property Status</FormLabel>
          <div className="relative">
            <InputIcon icon={Tag} />
            <Select
              value={data.propertyStatus || ""}
              onValueChange={(value) => updateData({ propertyStatus: value })}
            >
              <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select listing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Property Type */}
        <FieldWrapper>
          <FormLabel>Property Type</FormLabel>
          <div className="relative">
            <InputIcon icon={Building2} />
            <Select
              value={data.propertyType || ""}
              onValueChange={(value) => updateData({ propertyType: value })}
            >
              <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Property Specifications Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-primary" />
            Property Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bedrooms */}
            <FieldWrapper>
              <FormLabel>Bedrooms</FormLabel>
              <div className="relative">
                <InputIcon icon={Bed} />
                <Input
                  type="number"
                  value={data.bedrooms || ""}
                  onChange={handleNumberChange("bedrooms")}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  max="20"
                />
              </div>
            </FieldWrapper>

            {/* Bathrooms */}
            <FieldWrapper>
              <FormLabel>Bathrooms</FormLabel>
              <div className="relative">
                <InputIcon icon={Bath} />
                <Input
                  type="number"
                  value={data.bathrooms || ""}
                  onChange={handleNumberChange("bathrooms")}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  max="20"
                />
              </div>
            </FieldWrapper>

            {/* Property Size */}
            <FieldWrapper>
              <FormLabel>Size (sq ft)</FormLabel>
              <div className="relative">
                <InputIcon icon={Maximize2} />
                <Input
                  type="number"
                  value={data.propertySize || ""}
                  onChange={handleNumberChange("propertySize")}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  step="50"
                />
              </div>
            </FieldWrapper>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}

      <StepController onNext={next} onPrev={prev} showPrev={true} />
    </div>
  );
}

export default StepThreeDetails;
