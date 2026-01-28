"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

const RULES = [
  { id: "min-length", label: "At least 8 characters", validator: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter", validator: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter", validator: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "At least one number", validator: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "At least one special character", validator: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function PasswordInput({ className, showStrength = false, onChange, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Handle controlled vs uncontrolled
  // If props.value is provided, use it. Otherwise use internalValue for the meter.
  const valueForMeter = props.value !== undefined ? String(props.value) : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  const results = RULES.map((rule) => ({
    ...rule,
    passed: rule.validator(valueForMeter),
  }));

  const passedCount = results.filter((r) => r.passed).length;
  const score = passedCount; // Simple score 0-5

  // Entropy Calculation (Simple)
  const calculateEntropy = (password: string) => {
    if (!password) return 0;
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 32;
    return password.length * Math.log2(pool || 1);
  };

  const entropy = calculateEntropy(valueForMeter);
  // Max expected entropy roughly 12 * log2(94) ~= 78. Let's say 80 is full bar.
  const entropyPercent = Math.min(100, (entropy / 80) * 100);

  const getStrengthColor = () => {
    if (score <= 2) return "bg-red-500";
    if (score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
      if (score === 0) return "Very Weak";
      if (score <= 2) return "Weak";
      if (score <= 4) return "Medium";
      return "Strong";
  };

  return (
    <div className="relative">
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pl-10 pr-10", className)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1} // Skip tab focus for the eye button
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {showStrength && isFocused && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 p-3 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-3">
                {/* Strength Meter */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                        <span>Strength</span>
                        <span className={cn(
                            score <= 2 && "text-red-500",
                            score > 2 && score <= 4 && "text-yellow-500",
                            score === 5 && "text-green-500"
                        )}>{getStrengthLabel()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300 ease-out", getStrengthColor())}
                            style={{ width: `${entropyPercent}%` }}
                        />
                    </div>
                </div>

                {/* Checklist */}
                <ul className="space-y-1">
                    {results.map((rule) => (
                    <li key={rule.id} className="flex items-center space-x-2 text-xs">
                        {rule.passed ? (
                        <Check className="h-3 w-3 text-green-500" />
                        ) : (
                        <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className={cn(rule.passed ? "text-muted-foreground" : "text-foreground")}>
                            {rule.label}
                        </span>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
}
