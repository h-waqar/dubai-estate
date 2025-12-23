// src\components\sections\Newsletter.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { CheckCircle2 } from "lucide-react";

interface StatProps {
  number: string;
  label: string;
}

const Stat = ({ number, label }: StatProps) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await subscribeToNewsletter(formData);

      if (result.success) {
        setIsSuccess(true);
        // toast.success(result.message || "Successfully subscribed!");
        setEmail("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white dark:bg-gray-800">
          <CardContent className="p-12 text-center">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Thank You for Subscribing!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                  You've successfully joined our newsletter. Keep an eye on your inbox for the latest Dubai real estate updates.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="mt-8 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Subscribe another email
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Stay Updated with Dubai Real Estate
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                  Get weekly insights, market updates, and exclusive property deals
                  delivered to your inbox
                </p>

                {/* Newsletter Form */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-500"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                </form>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <Stat number="15K+" label="Subscribers" />
                  <Stat number="Weekly" label="Updates" />
                  <Stat number="Expert" label="Insights" />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No spam, unsubscribe at any time. We respect your privacy.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
