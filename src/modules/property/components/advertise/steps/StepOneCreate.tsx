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
    listingType, // Changed from propertyStatus
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
      listingType: listingType || "SALE", // Changed from propertyStatus
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
        listingType: value.listingType, // Changed from propertyStatus
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
    if (location && location !== watch("location")) {
      setValue("location", location, { shouldValidate: true, shouldDirty: true });
    }
  }, [location, setValue, watch]);



  const onSubmit = () => {
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Listing Property (sale/rent/off_plan) */}
        <FieldWrapper>
          <FormLabel>Listing Property</FormLabel>
          <div className="relative">
            <InputIcon icon={Tag} />
            <Controller
              name="listingType" // Changed from propertyStatus
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">For Sale</SelectItem>
                    <SelectItem value="RENT">For Rent</SelectItem>
                    <SelectItem value="OFF_PLAN">Off Plan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* @ts-ignore - listingType might not be in errors type yet if not updated */}
          {errors.listingType && (
            <p className="text-sm text-destructive mt-1">
              {/* @ts-ignore */}
              {errors.listingType.message}
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
