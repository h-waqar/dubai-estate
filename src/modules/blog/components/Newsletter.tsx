// src\modules\blog\components\Newsletter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await subscribeToNewsletter(formData);

      if (result.success) {
        setIsSuccess(true);
        // toast.success(result.message || "Thanks for subscribing!");
        setEmail("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mb-12">
      <div className="max-w-xl mx-auto text-center">
        {isSuccess ? (
          <div className="py-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Welcome Aboard!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for subscribing. You'll now receive the latest property insights directly to your inbox.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              size="sm"
            >
              Subscribe another email
            </Button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest Dubai real estate insights, market trends, and
              exclusive property listings delivered to your inbox.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
