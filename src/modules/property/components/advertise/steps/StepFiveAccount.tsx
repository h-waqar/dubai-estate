// src/modules/property/advertise/components/steps/StepFiveAccount.tsx
"use client";

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
  Loader2, // Added for loading state
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"; // <-- Import useSession
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { stepFiveSchema } from "../../../validators/advertise-steps.validator";
import { toast } from "sonner";

interface StepFiveAccountProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

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
  const { data: session, status } = useSession(); // <-- Get auth status

  // Handler for all text/email/password inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ [e.target.name]: e.target.value });
  };

  // Handler for the plan RadioGroup
  const handlePlanChange = (value: string) => {
    update({ plan: value });
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
    <div className="space-y-8">
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
                  name="username"
                  value={username || ""}
                  onChange={handleChange}
                  placeholder="e.g., luxury_developer"
                  className="h-12 pl-10 border-input bg-background"
                />
              </div>
            </FieldWrapper>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper>
                <FormLabel required>Password</FormLabel>
                <div className="relative">
                  <InputIcon icon={Lock} />
                  <Input
                    name="password"
                    type="password"
                    value={password || ""}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 pl-10 border-input bg-background"
                  />
                </div>
              </FieldWrapper>
              <FieldWrapper>
                <FormLabel required>Repeat Password</FormLabel>
                <div className="relative">
                  <InputIcon icon={Lock} />
                  <Input
                    name="repeatPassword"
                    type="password"
                    value={repeatPassword || ""}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-12 pl-10 border-input bg-background"
                  />
                </div>
              </FieldWrapper>
            </div>

            {/* Email Field */}
            <FieldWrapper>
              <FormLabel required>Which email can we contact you on?</FormLabel>
              <div className="relative">
                <InputIcon icon={Mail} />
                <Input
                  name="email"
                  type="email"
                  value={email || ""}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 pl-10 border-input bg-background"
                />
              </div>
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
          <RadioGroup
            value={plan || "silver"}
            onValueChange={handlePlanChange}
          >
            {/* Silver Package Card */}
            <Label
              htmlFor="plan-silver"
              className={cn(
                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                (plan === "silver" || !plan) &&
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
                plan === "gold" && "border-primary bg-muted"
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
        </div>
      </div>

      {/* Navigation */}
      <StepController 
        onNext={() => {
          // If authenticated, we only need to validate the plan (or skip validation if plan is pre-selected)
          // But the schema handles optional fields. Let's check.
          // If authenticated, username/email/password are not in the form, so they will be undefined.
          // The schema makes them optional, so it should pass if we don't provide them.
          // However, we need to ensure we don't validate them if they are not visible.
          
          const dataToValidate = {
            plan,
            ...(status === "unauthenticated" ? {
              username,
              email,
              password,
              repeatPassword,
            } : {})
          };

          const result = stepFiveSchema.safeParse(dataToValidate);

          if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            Object.values(errors).forEach((error) => {
              if (error) toast.error(error[0]);
            });
            return;
          }
          next();
        }} 
        onPrev={prev} 
        showPrev={true} 
      />
    </div>
  );
}

export default StepFiveAccount;
