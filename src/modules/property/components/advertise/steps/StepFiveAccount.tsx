import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import {
  User,
  Lock,
  Mail,
  Info,
  Clock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { stepFiveGuestSchema, stepFiveAuthSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";

interface StepFiveAccountProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

// We use the Auth schema for the type as it allows optional fields (compatible with both)
type StepFiveData = z.infer<typeof stepFiveAuthSchema>;

function StepFiveAccount({}: StepFiveAccountProps) {
  const { next, prev } = useStepStore();
  const {
    username,
    password,
    repeatPassword,
    email,
    plan,
    update,
  } = useAdvertiseFormStore();
  const { data: session, status } = useSession();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StepFiveData>({
    resolver: (values, context, options) => {
      const schema = status === "authenticated" ? stepFiveAuthSchema : stepFiveGuestSchema;
      return zodResolver(schema)(values, context, options);
    },
    defaultValues: {
      username: username || "",
      password: password || "",
      repeatPassword: repeatPassword || "",
      email: email || "",
      plan: plan || "silver",
    },
  });

  // Sync form -> store
  useEffect(() => {
    const subscription = watch((value) => {
      update({
        username: value.username,
        password: value.password,
        repeatPassword: value.repeatPassword,
        email: value.email,
        plan: value.plan,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  const onSubmit = () => {
    next();
  };

  // --- Show loader while checking auth status ---
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Checking account...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Card container */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Header */}
        <h2 className="text-2xl font-semibold">05 Account & Plan</h2>

        {/* --- Conditionally show New Account Section --- */}
        {status === "unauthenticated" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium border-b pb-2">New Account</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Create a username for your account.
              <Info className="w-4 h-4" />
            </p>

            {/* Username */}
            <FieldWrapper>
              <FormLabel required>Username</FormLabel>
              <div className="relative">
                <InputIcon icon={User} />
                <Input
                  {...register("username")}
                  placeholder="e.g., luxury_developer"
                  className="h-12 pl-10 border-input bg-background"
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive mt-1">
                  {errors.username.message}
                </p>
              )}
            </FieldWrapper>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper>
                <FormLabel required>Password</FormLabel>
                <div className="relative">
                  <InputIcon icon={Lock} />
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="h-12 pl-10 border-input bg-background"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </FieldWrapper>
              <FieldWrapper>
                <FormLabel required>Repeat Password</FormLabel>
                <div className="relative">
                  <InputIcon icon={Lock} />
                  <Input
                    type="password"
                    {...register("repeatPassword")}
                    placeholder="••••••••"
                    className="h-12 pl-10 border-input bg-background"
                  />
                </div>
                {errors.repeatPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.repeatPassword.message}
                  </p>
                )}
              </FieldWrapper>
            </div>

            {/* Email Field */}
            <FieldWrapper>
              <FormLabel required>Which email can we contact you on?</FormLabel>
              <div className="relative">
                <InputIcon icon={Mail} />
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="h-12 pl-10 border-input bg-background"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </FieldWrapper>
          </div>
        )}

        {/* --- Show this if user IS authenticated --- */}
        {status === "authenticated" && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h3 className="font-semibold">
              Welcome back, {session.user?.name || session.user?.email}!
            </h3>
            <p className="text-sm text-muted-foreground">
              You're already logged in. Just select your plan to continue.
            </p>
          </div>
        )}

        {/* --- Plan Section (Always shows) --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Plan</h3>
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                {/* Silver Package Card */}
                <Label
                  htmlFor="plan-silver"
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    (field.value === "silver" || !field.value) &&
                      "border-primary bg-muted"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="silver" id="plan-silver" />
                    <div>
                      <p className="font-semibold">Silver Package</p>
                      <p className="text-sm text-muted-foreground">
                        $10 monthly ad display.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">$10</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Label>

                {/* Gold Package Card */}
                <Label
                  htmlFor="plan-gold"
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    field.value === "gold" && "border-primary bg-muted"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="gold" id="plan-gold" />
                    <div>
                      <p className="font-semibold">Gold Package</p>
                      <p className="text-sm text-muted-foreground">
                        $25 monthly featured display.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">$25</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Label>
              </RadioGroup>
            )}
          />
          {errors.plan && (
            <p className="text-sm text-destructive mt-1">
              {errors.plan.message}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <StepController 
        onNext={handleSubmit(onSubmit)}
        onPrev={prev} 
        showPrev={true} 
      />
    </form>
  );
}

export default StepFiveAccount;
