"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      email: "",
      phone: "",
      contactMethod: "Phone",
    },
  });

  async function onSubmit(values: CallbackRequestInput) {
    const result = await createCallbackRequest(values);
    if (result.success) {
      toast.success("Request received! We will contact you shortly.");
      form.reset();
    }
  }

  return (
    <div className="container mx-auto my-12 grid grid-cols-1 gap-12 lg:grid-cols-10">
      {/* Left Column: Image and Text */}
      <div className="space-y-6 lg:col-span-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Let's Find You Dream Property
        </h2>
        <p className="text-muted-foreground">
          Submit your details, and one if our expert property consultants will
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

                {/* TODO: Add the rest of the fields here following the same pattern */}
                {/* - Phone (Input) */}
                {/* - Email (Input) */}
                {/* - Preferred Time to Call (Select) */}
                {/* - Purpose of Purchase (Select) */}
                {/* - Budget (Select) */}
                {/* - Preferred Location (Input) */}
                {/* - Message (Textarea) */}

                <Button type="submit" disabled={form.formState.isSubmitting}>
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
