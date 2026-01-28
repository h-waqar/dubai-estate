"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { forgotPasswordAction } from "@/modules/user/actions/forgot-password.action";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    if (captchaToken) {
        formData.set("cf-turnstile-response", captchaToken);
    }

    try {
      const res = await forgotPasswordAction(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        setSent(true);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <Toaster richColors />
      {sent ? (
        <div className="grid gap-6 text-center">
          <div className="rounded-md bg-green-50 p-4 text-green-700 border border-green-200">
            <p>If an account exists, you will receive a password reset link shortly.</p>
          </div>
          <Link href="/login">
            <Button variant="outline" className="w-full">Back to Login</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
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

            <TurnstileWidget
                className="flex justify-center"
                onSuccess={setCaptchaToken}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <Link href="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}