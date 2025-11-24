import { z } from "zod";
import { FurnishingStatus } from "@/generated/prisma";
import type { Media } from "@/modules/media/types/media.types";

export const stepOneSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  propertyStatus: z.string().min(1, "Property status is required."),
  propertyTypeId: z.number().int().positive("Property type is required."),
  location: z.string().min(5, "Location is required."),
});

export const stepTwoSchema = z.object({
  description: z.string().min(20, "Description must be at least 20 characters long."),
  features: z.array(z.string()).min(1, "Select at least one feature."),
});

export const stepThreeSchema = z.object({
  price: z.number().positive("Price must be positive."),
  bedrooms: z.number().int().min(0, "Bedrooms must be 0 or more."),
  bathrooms: z.number().int().min(0, "Bathrooms must be 0 or more."),
  propertySize: z.number().positive("Size must be positive."),
  furnishing: z.enum(FurnishingStatus),
});

export const stepFourSchema = z.object({
  coverImage: z.custom<Media | null | undefined>().refine((val) => !!val, { message: "Cover image is required." }),
  gallery: z.array(z.custom<Media>()).min(1, "Add at least one gallery image."),
});

export const stepFiveGuestSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  repeatPassword: z.string(),
  plan: z.string().min(1, "Plan is required."),
}).refine((data) => {
  if (data.password && data.password !== data.repeatPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["repeatPassword"],
});

export const stepFiveAuthSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  repeatPassword: z.string().optional(),
  plan: z.string().min(1, "Plan is required."),
});

// For backward compatibility if needed, or just use one of them as default type
export const stepFiveSchema = stepFiveGuestSchema;

export const stepSixSchema = z.object({
  paymentMethod: z.string().min(1, "Payment method is required."),
  cardholderName: z.string().min(3, "Cardholder name is required."),
  cardNumber: z.string().min(19, "Card number must be 16 digits."), // 16 digits + 3 spaces
  expiryDate: z.string().min(7, "Invalid expiry date."), // MM / YY
  cvv: z.string().min(3, "CVV must be 3 or 4 digits."),
  billingAddress1: z.string().min(5, "Address is required."),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(2, "City is required."),
  billingState: z.string().min(2, "State is required."),
  billingPostalCode: z.string().min(4, "Postal code is required."),
});
