import { z } from "zod";
import { FurnishingStatus } from "@/generated/prisma";

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
  coverImage: z.object({ id: z.number() }, { message: "Cover image is required." }),
  gallery: z.array(z.object({ id: z.number() })).min(1, "Add at least one gallery image."),
});

export const stepFiveSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").optional(),
  email: z.string().email("Invalid email address.").optional(),
  password: z.string().min(6, "Password must be at least 6 characters.").optional(),
  repeatPassword: z.string().optional(),
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
