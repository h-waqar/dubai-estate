// src\modules\property\components\advertise\steps\StepOneCreate.tsx
"use client";

import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import LocationSelector from "../LocationSelector";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { House, PenLine, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ✅ Use this, not @radix-ui/react-select
interface StepOneCreateProps {
  propertyTypes: { id: number; name: string; slug: string }[];
}
function StepOneCreate({ propertyTypes }: StepOneCreateProps) {
  const { data, updateData, next, prev } = useStepStore();

  // Handler for all text/email/password inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Property Status (sale/rent) */}
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

        {/* Property Type (dynamic from DB) */}
        <FieldWrapper>
          <FormLabel>Property Type</FormLabel>
          <div className="relative">
            <InputIcon icon={House} />
            <Select
              value={data.propertyTypeId?.toString() || ""}
              onValueChange={(value) =>
                updateData({ propertyTypeId: parseInt(value) })
              }
            >
              <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Property Title */}
        <FieldWrapper>
          <FormLabel required>Listing Title</FormLabel>
          <div className="relative">
            <InputIcon icon={PenLine} />
            <Input
              name="title"
              value={data.title || ""}
              onChange={handleChange}
              placeholder="e.g., luxury_developer_house"
              className="h-12 pl-10 border-input bg-background"
            />
          </div>
        </FieldWrapper>

        <LocationSelector />
      </div>
      <StepController onNext={next} onPrev={prev} showPrev={false} />
    </div>
  );
}

export default StepOneCreate;
