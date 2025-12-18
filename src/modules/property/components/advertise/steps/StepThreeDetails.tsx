import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import { Building2, Bed, Bath, Maximize2, DollarSign, Tag, PenLine } from "lucide-react";
import { stepThreeSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";

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

interface StepThreeDetailsProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

// Extend schema to include fields present in UI but not in original validation schema
const formSchema = stepThreeSchema.extend({
  currency: z.string(),
});

type StepThreeData = z.infer<typeof formSchema>;

function StepThreeDetails({ }: StepThreeDetailsProps) {
  const { next, prev } = useStepStore();
  const {
    price,
    currency,
    bedrooms,
    bathrooms,
    propertySize,
    furnishing,
    update,
  } = useAdvertiseFormStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepThreeData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: price || undefined,
      currency: currency || "AED",
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      propertySize: propertySize !== 0 ? propertySize : undefined,
      furnishing: furnishing || "UNFURNISHED",
    },
  });

  // Sync form -> store
  useEffect(() => {
    const subscription = watch((value) => {
      update({
        price: value.price,
        currency: value.currency,
        bedrooms: value.bedrooms,
        bathrooms: value.bathrooms,
        propertySize: value.propertySize,
        furnishing: value.furnishing,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  const onSubmit = () => {
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
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
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger className="shrink-0 min-h-12 border-input bg-background hover:bg-accent/50 transition-colors">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dollar (USD)</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldWrapper>
            <InputIcon icon={DollarSign} />
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="Enter price (e.g., 250000)"
              className="flex-1 h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
              min="0"
              step="1000"
            />
          </FieldWrapper>
        </div>
        {errors.price && (
          <p className="text-sm text-destructive mt-1">
            {errors.price.message}
          </p>
        )}



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
                  {...register("bedrooms", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  max="20"
                />
              </div>
              {errors.bedrooms && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bedrooms.message}
                </p>
              )}
            </FieldWrapper>

            {/* Bathrooms */}
            <FieldWrapper>
              <FormLabel>Bathrooms</FormLabel>
              <div className="relative">
                <InputIcon icon={Bath} />
                <Input
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  max="20"
                />
              </div>
              {errors.bathrooms && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bathrooms.message}
                </p>
              )}
            </FieldWrapper>

            {/* Property Size */}
            <FieldWrapper>
              <FormLabel>Size (sq ft)</FormLabel>
              <div className="relative">
                <InputIcon icon={Maximize2} />
                <Input
                  type="number"
                  {...register("propertySize", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-12 pl-10 border-input bg-background hover:border-primary/50 focus:border-primary transition-colors"
                  min="0"
                  step="50"
                />
              </div>
              {errors.propertySize && (
                <p className="text-sm text-destructive mt-1">
                  {errors.propertySize.message}
                </p>
              )}
            </FieldWrapper>
          </div>
        </div>
      </div>





      <StepController
        onNext={handleSubmit(onSubmit)}
        onPrev={prev}
        showPrev={true}
      />
    </form>
  );
}

export default StepThreeDetails;
