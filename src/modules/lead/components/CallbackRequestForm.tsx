"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  callbackRequestSchema,
  type CallbackRequestInput,
} from "../validators/callbackRequestSchema";
import createCallbackRequest from "../actions/createCallbackRequest";

function CallbackRequestForm() {
  const form = useForm<CallbackRequestInput>({
    resolver: zodResolver(callbackRequestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      contactMethod: "Phone",
      preferredTime: "",
      purchasePurpose: "",
      budget: undefined,
      location: "",
      message: "",
    },
  });

  async function onSubmit(values: CallbackRequestInput) {
    const result = await createCallbackRequest(values);
    if (result.success) {
      toast.success("Request received! We will contact you shortly.");
      form.reset();
    } else {
      toast.error("Failed to submit request. Please try again.");
    }
  }

  return (
    <div className="container mx-auto my-12 grid grid-cols-1 gap-12 lg:grid-cols-10">
      {/* Left Column: Image and Text */}
      <div className="space-y-6 lg:col-span-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Let's Find Your Dream Property
        </h2>
        <p className="text-muted-foreground">
          Submit your details, and one of our expert property consultants will
          contact you within one business hour to assist you.
        </p>
        <div className="relative h-80 w-full overflow-hidden rounded-lg">
          <Image
            src="/assets/dubai-hero.jpg"
            alt="Callback request illustration"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="lg:col-span-6">
        <Card>
          <CardHeader>
            <CardTitle>Request a Callback</CardTitle>
            <CardDescription>
              Fill out the form below to get started.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Method */}
                <FormField
                  control={form.control}
                  name="contactMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Preferred Contact Method *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Phone" />
                            </FormControl>
                            <FormLabel className="font-normal">Phone</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Email" />
                            </FormControl>
                            <FormLabel className="font-normal">Email</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+971 55 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="example@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Time */}
                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time to Contact</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Morning">
                              Morning (9 AM – 12 PM)
                            </SelectItem>
                            <SelectItem value="Afternoon">
                              Afternoon (12 PM – 5 PM)
                            </SelectItem>
                            <SelectItem value="Evening">
                              Evening (5 PM – 8 PM)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Purpose */}
                <FormField
                  control={form.control}
                  name="purchasePurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Purchase</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Investment">
                              Investment
                            </SelectItem>
                            <SelectItem value="Personal Use">
                              Personal Use
                            </SelectItem>
                            <SelectItem value="Relocation">
                              Relocation
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Budget */}
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (AED)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={
                            field.value ? String(field.value) : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500000">Under 500K</SelectItem>
                            <SelectItem value="1000000">Up to 1M</SelectItem>
                            <SelectItem value="5000000">1M – 5M</SelectItem>
                            <SelectItem value="10000000">5M – 10M</SelectItem>
                            <SelectItem value="20000000">10M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dubai Marina, Downtown, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about what you’re looking for..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : "Request Callback"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CallbackRequestForm;
