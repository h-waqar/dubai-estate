// // src/modules/property/advertise/components/steps/StepFiveAccount.tsx
// "use client";

// import { Input } from "@/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import StepController from "./StepController";
// import { useStepStore } from "../../../stores/useStepStore";
// import { User, Lock, Mail, Info, Clock, Building } from "lucide-react";
// import { cn } from "@/lib/utils";

// // Reusing the FormLabel from StepThreeDetails
// const FormLabel = ({
//   children,
//   required,
// }: {
//   children: React.ReactNode;
//   required?: boolean;
// }) => (
//   <label className="block text-sm font-semibold text-foreground mb-2.5 tracking-tight">
//     {children}
//     {required && (
//       <span className="text-red-500 ml-1 font-bold" aria-label="required">
//         *
//       </span>
//     )}
//   </label>
// );

// // Reusing the FieldWrapper from StepThreeDetails
// const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
//   <div className="group relative">{children}</div>
// );

// // Reusing the InputIcon from StepThreeDetails
// const InputIcon = ({ icon: Icon }: { icon: any }) => (
//   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
//     <Icon className="w-4 h-4" />
//   </div>
// );

// function StepFiveAccount() {
//   const { data, updateData, next, prev } = useStepStore();

//   // Handler for all text/email/password inputs
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     updateData({ [e.target.name]: e.target.value });
//   };

//   // Handler for the plan RadioGroup
//   const handlePlanChange = (value: string) => {
//     updateData({ plan: value });
//   };

//   return (
//     <div className="space-y-8">
//       {/* Card container */}
//       <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
//         {/* Header */}
//         <h2 className="text-2xl font-semibold">05 Account</h2>

//         {/* --- New Account Section --- */}
//         <div className="space-y-6">
//           <h3 className="text-lg font-medium border-b pb-2">New Account</h3>
//           <p className="text-sm text-muted-foreground flex items-center gap-2">
//             Create a username for your account.
//             <Info className="w-4 h-4" />
//           </p>

//           {/* Username */}
//           <FieldWrapper>
//             <FormLabel required>Username</FormLabel>
//             <div className="relative">
//               <InputIcon icon={User} />
//               <Input
//                 name="username"
//                 value={data.username || ""}
//                 onChange={handleChange}
//                 placeholder="e.g., luxury_developer"
//                 className="h-12 pl-10 border-input bg-background"
//                 />
//             </div>
//           </FieldWrapper>

//           {/* Password Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FieldWrapper>
//               <FormLabel required>Password</FormLabel>
//               <div className="relative">
//                 <InputIcon icon={Lock} />
//                 <Input
//                   name="password"
//                   type="password"
//                   value={data.password || ""}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="h-12 pl-10 border-input bg-background"
//                   />
//               </div>
//             </FieldWrapper>
//             <FieldWrapper>
//               <FormLabel required>Repeat Password</FormLabel>
//               <div className="relative">
//                 <InputIcon icon={Lock} />
//                 <Input
//                   name="repeatPassword"
//                   type="password"
//                   value={data.repeatPassword || ""}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   className="h-12 pl-10 border-input bg-background"
//                   />
//               </div>
//             </FieldWrapper>
//           </div>

//           {/* Email Field */}
//           <FieldWrapper>
//             <FormLabel required>Which email can we contact you on?</FormLabel>
//             <div className="relative">
//               <InputIcon icon={Mail} />
//               <Input
//                 name="email"
//                 type="email"
//                 value={data.email || ""}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 className="h-12 pl-10 border-input bg-background"
//                 />
//             </div>
//           </FieldWrapper>
//         </div>

//         {/* --- Plan Section --- */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium border-b pb-2">Plan</h3>
//           <RadioGroup
//             value={data.plan || "silver"}
//             onValueChange={handlePlanChange}
//             >
//             {/* Silver Package Card */}
//             <Label
//               htmlFor="plan-silver"
//               className={cn(
//                 "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
//                 data.plan === "silver" && "border-primary bg-muted"
//               )}
//               >
//               <div className="flex items-center gap-4">
//                 <RadioGroupItem value="silver" id="plan-silver" />
//                 <div>
//                   <p className="font-semibold">Silver Package</p>
//                   <p className="text-sm text-muted-foreground">
//                     $10 monthly ad display.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-lg font-bold">$10</span>
//                 <Clock className="w-4 h-4 text-muted-foreground" />
//               </div>
//             </Label>

//             {/* Add more plans here if needed, e.g.: */}
//             <Label
//               htmlFor="plan-gold"
//               className={cn(
//                 "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
//                 data.plan === "gold" && "border-primary bg-muted"
//               )}
//               >
//               <div className="flex items-center gap-4">
//                 <RadioGroupItem value="gold" id="plan-gold" />
//                 <div>
//                   <p className="font-semibold">Gold Package</p>
//                   <p className="text-sm text-muted-foreground">
//                     $25 monthly featured display.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-lg font-bold">$25</span>
//                 <Clock className="w-4 h-4 text-muted-foreground" />
//               </div>
//             </Label>
//           </RadioGroup>
//         </div>
//       </div>

//       {/* Navigation */}
//       <StepController onNext={next} onPrev={prev} showPrev={true} />
//     </div>
//   );
// }

// export default StepFiveAccount;

// =================================================================================
// =================================================================================
// =================================================================================

// src/modules/property/advertise/components/steps/StepFiveAccount.tsx
"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
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

// ... (FormLabel, FieldWrapper, InputIcon components remain the same) ...
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

const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="group relative">{children}</div>
);

const InputIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
    <Icon className="w-4 h-4" />
  </div>
);

function StepFiveAccount() {
  const { data, updateData, next, prev } = useStepStore();
  const { data: session, status } = useSession(); // <-- Get auth status

  // Handler for all text/email/password inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  // Handler for the plan RadioGroup
  const handlePlanChange = (value: string) => {
    updateData({ plan: value });
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
                  value={data.username || ""}
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
                    value={data.password || ""}
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
                    value={data.repeatPassword || ""}
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
                  value={data.email || ""}
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
            value={data.plan || "silver"}
            onValueChange={handlePlanChange}
          >
            {/* Silver Package Card */}
            <Label
              htmlFor="plan-silver"
              className={cn(
                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                (data.plan === "silver" || !data.plan) &&
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
                data.plan === "gold" && "border-primary bg-muted"
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
      <StepController onNext={next} onPrev={prev} showPrev={true} />
    </div>
  );
}

export default StepFiveAccount;
