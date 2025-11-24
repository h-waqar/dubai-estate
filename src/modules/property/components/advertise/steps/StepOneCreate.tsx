import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import LocationSelector from "../LocationSelector";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { House, PenLine, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stepOneSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";

interface StepOneCreateProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

type StepOneData = z.infer<typeof stepOneSchema>;

function StepOneCreate({ propertyTypes }: StepOneCreateProps) {
  const { next, prev } = useStepStore();
  const {
    title,
    propertyStatus,
    propertyTypeId,
    location,
    latitude,
    longitude,
    update,
  } = useAdvertiseFormStore();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: title || "",
      propertyStatus: propertyStatus || "",
      propertyTypeId: propertyTypeId || undefined,
      location: location || "",
      latitude: latitude || undefined,
      longitude: longitude || undefined,
    },
  });

  // Sync form changes to Zustand store
  useEffect(() => {
    const subscription = watch((value) => {
      update({
        title: value.title,
        propertyStatus: value.propertyStatus,
        propertyTypeId: value.propertyTypeId,
        location: value.location,
        latitude: value.latitude,
        longitude: value.longitude,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  // Sync Store -> Form for location (updated by LocationSelector)
  useEffect(() => {
    if (location) {
      setValue("location", location, { shouldValidate: true });
    }
  }, [location, setValue]);

  const onSubmit = () => {
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Property Status (sale/rent) */}
        <FieldWrapper>
          <FormLabel>Property Status</FormLabel>
          <div className="relative">
            <InputIcon icon={Tag} />
            <Controller
              name="propertyStatus"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                    <SelectValue placeholder="Select listing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.propertyStatus && (
            <p className="text-sm text-destructive mt-1">
              {errors.propertyStatus.message}
            </p>
          )}
        </FieldWrapper>

        {/* Property Type (dynamic from DB) */}
        <FieldWrapper>
          <FormLabel>Property Type</FormLabel>
          <div className="relative">
            <InputIcon icon={House} />
            <Controller
              name="propertyTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value?.toString()}
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
              )}
            />
          </div>
          {errors.propertyTypeId && (
            <p className="text-sm text-destructive mt-1">
              {errors.propertyTypeId.message}
            </p>
          )}
        </FieldWrapper>

        {/* Property Title */}
        <FieldWrapper>
          <FormLabel required>Listing Title</FormLabel>
          <div className="relative">
            <InputIcon icon={PenLine} />
            <Input
              {...register("title")}
              placeholder="e.g., luxury_developer_house"
              className="h-12 pl-10 border-input bg-background"
            />
          </div>
          {errors.title && (
            <p className="text-sm text-destructive mt-1">
              {errors.title.message}
            </p>
          )}
        </FieldWrapper>

        {/* Location Selector needs to be integrated or synced */}
        {/* Assuming LocationSelector updates the store directly, we need to sync it back to the form or pass control */}
        {/* For now, let's assume LocationSelector updates the store and we watch the store to update the form if needed, 
            BUT here we are doing form -> store. 
            If LocationSelector is a separate component that updates the store, we might need to register 'location' manually 
            or pass setValue to it. 
            Let's look at LocationSelector usage. It was just <LocationSelector />. 
            I'll check LocationSelector implementation next. For now, I'll keep it as is but register a hidden input for location to validate it.
        */}
        <LocationSelector />
        <input type="hidden" {...register("location")} />
        {errors.location && (
            <p className="text-sm text-destructive mt-1">
              {errors.location.message}
            </p>
          )}

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper>
            <FormLabel>Latitude</FormLabel>
            <Input
              {...register("latitude", { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="e.g. 25.2048"
              className="h-12 border-input bg-background"
            />
            {errors.latitude && (
              <p className="text-sm text-destructive mt-1">
                {errors.latitude.message}
              </p>
            )}
          </FieldWrapper>
          <FieldWrapper>
            <FormLabel>Longitude</FormLabel>
            <Input
              {...register("longitude", { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="e.g. 55.2708"
              className="h-12 border-input bg-background"
            />
            {errors.longitude && (
              <p className="text-sm text-destructive mt-1">
                {errors.longitude.message}
              </p>
            )}
          </FieldWrapper>
        </div>
      </div>
      
      <StepController 
        onNext={handleSubmit(onSubmit)}
        onPrev={prev} 
        showPrev={false} 
      />
    </form>
  );
}

export default StepOneCreate;
