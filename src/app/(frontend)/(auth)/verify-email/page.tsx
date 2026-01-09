"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailAction } from "@/modules/user/actions/verify-email.action";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    verifyEmailAction(token).then((res) => {
      if (res.error) {
        setStatus("error");
        setMessage(res.error);
      } else {
        setStatus("success");
        setMessage(res.message || "Email verified successfully!");
      }
    });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">{message}</p>
        </>
      )}
      
      {status === "success" && (
        <>
          <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Verified!</h2>
          <p className="text-muted-foreground">{message}</p>
          <Button onClick={() => router.push("/login")} className="mt-4 w-full">
            Go to Login
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20">
            <XCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Verification Failed</h2>
          <p className="text-muted-foreground">{message}</p>
          <Button onClick={() => router.push("/login")} variant="outline" className="mt-4 w-full">
            Back to Login
          </Button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Email Verification"
      description="Please wait while we verify your email address."
    >
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin"/></div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
