"use client";

import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import { resendVerificationEmailAction } from "@/modules/user/actions/verify-email.action";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

function VerifyEmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await resendVerificationEmailAction(email);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Verification email resent!");
      }
    } catch (error) {
      toast.error("Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <div className="rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/20">
        <Mail className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
          <br/>
          Please check your inbox and verify your account.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          (Link expires in 30 minutes)
        </p>
      </div>

      <div className="w-full space-y-4 pt-4">
        <Button 
          onClick={handleResend} 
          variant="outline" 
          className="w-full"
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend Email"
          )}
        </Button>

        <Button asChild className="w-full" variant="ghost">
          <Link href="/login">
            Back to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailSentPage() {
  return (
    <AuthLayout
      title="Verify Email"
      description=""
    >
      <Toaster richColors />
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin"/></div>}>
        <VerifyEmailSentContent />
      </Suspense>
    </AuthLayout>
  );
}
