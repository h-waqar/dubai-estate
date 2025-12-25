"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("captchaToken", captchaToken);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success(result.message);
        (e.target as HTMLFormElement).reset();
        setCaptchaToken("");
      } else {
        // Handle generic or field-specific errors
        if (typeof result.error === 'string') {
          toast.error(result.error);
        } else {
          // Just show the first error found for simplicity, or generic
          toast.error("Please check your input and try again.");
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We'd love to hear from you. Please fill out the form below.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your Message" rows={5} required />
              </div>

              <div className="flex justify-center">
                <TurnstileWidget onSuccess={setCaptchaToken} />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Image */}
          <div className="hidden md:block">
            <Image
              src="/assets/dubai-hero.jpg"
              alt="Contact us"
              width={900}
              height={700}
              // fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
