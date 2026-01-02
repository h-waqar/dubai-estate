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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormInput, contactFormSchema } from "@/validators/contact";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      captchaToken: "",
    },
  });

  async function onSubmit(data: ContactFormInput) {
    setLoading(true);

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        toast.success(result.message);
        form.reset();
        // Reset captcha manually if needed, or component does it? 
        // The TurnstileWidget receives a key or ref to reset? 
        // For simplicity, we just reset the form value.
      } else {
        if (typeof result.error === 'string') {
          toast.error(result.error);
        } else {
          // Field errors
          Object.entries(result.error || {}).forEach(([key, errors]) => {
            const message = Array.isArray(errors) ? errors[0] : errors;
            if (key in data) {
              form.setError(key as keyof ContactFormInput, { type: "server", message });
            } else {
              toast.error(message);
            }
          });
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

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your Message" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center flex-col items-center">
                  <TurnstileWidget onSuccess={(token) => {
                    form.setValue("captchaToken", token);
                    form.clearErrors("captchaToken");
                  }} />
                  {form.formState.errors.captchaToken && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.captchaToken.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
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
