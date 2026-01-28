"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { registerUser } from "@/modules/user/actions/register.action";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import { Checkbox } from "@/components/ui/checkbox";

import { PasswordInput } from "@/components/auth/PasswordInput";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (captchaToken) {
      formData.set("cf-turnstile-response", captchaToken);
    }

    try {
      const res = await registerUser(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message || "Please check your email to verify your account.");
        // Redirect to verify-email-sent page
        const email = formData.get("email") as string;
        setTimeout(() => {
          window.location.href = `/verify-email-sent?email=${encodeURIComponent(email)}`;
        }, 1000);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      description="Enter your details below to create your account."
    >
      <Toaster richColors />
      <div className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* ... existing fields ... */}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              required
              showStrength
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" name="newsletter" defaultChecked />
            <Label htmlFor="newsletter" className="text-sm font-normal text-muted-foreground">
              Subscribe to our newsletter for updates
            </Label>
          </div>

          <TurnstileWidget
            className="flex justify-center"
            onSuccess={setCaptchaToken}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuth />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}