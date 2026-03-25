import { z } from "zod";
import type { Media } from "@/modules/media/types/media.types";

export const stepOneSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  listingType: z.enum(["SALE", "RENT", "OFF_PLAN"]),
  propertyTypeId: z.number().int().positive("Property type is required."),
  location: z.string().min(5, "Location is required."),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
  furnishing: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]),
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
  cardholderName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  billingAddress1: z.string().optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostalCode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    if (!data.cardholderName || data.cardholderName.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Cardholder name is required.", path: ["cardholderName"] });
    }
    if (!data.cardNumber || data.cardNumber.length < 19) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card number must be 16 digits.", path: ["cardNumber"] });
    }
    if (!data.expiryDate || data.expiryDate.length < 7) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid expiry date.", path: ["expiryDate"] });
    }
    if (!data.cvv || data.cvv.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVV must be 3 or 4 digits.", path: ["cvv"] });
    }
    if (!data.billingAddress1 || data.billingAddress1.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address is required.", path: ["billingAddress1"] });
    }
    if (!data.billingCity || data.billingCity.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required.", path: ["billingCity"] });
    }
    if (!data.billingState || data.billingState.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required.", path: ["billingState"] });
    }
    if (!data.billingPostalCode || data.billingPostalCode.length < 4) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Postal code is required.", path: ["billingPostalCode"] });
    }
  }
});
