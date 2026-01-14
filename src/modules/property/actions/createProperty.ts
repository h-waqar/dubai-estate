// src/modules/property/actions/createProperty.ts
"use server";
import { revalidatePath } from "next/cache";
import { createPropertyServerValidator } from "../validators/createProperty.validator";
import * as propertyService from "../services/createProperty";
import { authOptions } from "@/modules/user/routes/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus, PaymentStatus } from "@/generated/prisma";
// import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createPropertyAction(formData: FormData) {
  // console.log("🔥 createPropertyAction received:", formData);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Determine initial status based on role
  // Admins/Managers -> APPROVED immediately (or DRAFT if they prefer, but sticking to previous behavior implies likely live)
  // Users -> PENDING_REVIEW
  const isAdminOrManager = session.user.role === "ADMIN" || session.user.role === "MANAGER";
  // User requested manual approval for everyone, so we disable auto-approve for admins.
  const initialStatus = "PENDING_REVIEW";
  // const initialStatus = isAdminOrManager ? "APPROVED" : "PENDING_REVIEW";
  // For users, it's not published until approved. For admins, we can default published to true or let them toggle.
  // The schema has published @default(false). Let's keep it false for consistency or true for admins?
  // Let's set it to false by default for everyone to be safe, or true for admins if that was desired.
  // User said "approve only then they will be visible", implies published=true might be conflated with status=APPROVED.
  // Actually, let's keep published=false by default for everyone, but status=APPROVED for admins.

  // 2. Convert FormData to plain object
  // const data = Object.fromEntries(formData);
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    propertyTypeId: formData.get("propertyTypeId"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    location: formData.get("location"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    furnishing: formData.get("furnishing"),
    listingType: formData.get("listingType"),
    description: formData.get("description") || "",
    coverImage: formData.get("coverImage"),
    gallery: formData.getAll("gallery[]"),
    features: formData.getAll("features[]"),
    developerId: formData.get("developerId") ? Number(formData.get("developerId")) : undefined,
    proposedDeveloperName: formData.get("proposedDeveloperName")?.toString() || undefined,
  };
  
  const planSlug = formData.get("planSlug")?.toString();
  const subscriptionId = formData.get("subscriptionId")?.toString();

  // console.log("Parsed data for Zod:", data);
  // 3. Validate using the SERVER validator (with z.coerce)
  const validation = createPropertyServerValidator.safeParse(data);
  if (!validation.success) {
    // console.log("📩 Incoming createProperty data:", data);
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    };
  }
  // 4. Create property in database
  try {
    // If subscription data is present, create a new Subscription record
    // Refactored to support multiple subscriptions (1-to-Many)
    if (planSlug && subscriptionId) {
      const plan = await prisma.pricingPlan.findUnique({
        where: { slug: planSlug },
      });

      if (plan) {
        // Create Subscription Record
        const subscription = await prisma.subscription.create({
          data: {
            userId: session.user.id,
            planId: plan.id,
            paypalSubscriptionId: subscriptionId,
            status: SubscriptionStatus.ACTIVE, // Assumed active upon successful creation via PayPal
            priceAtSubscription: plan.priceMonthly || 0, // Fallback if null
            currency: "USD", // Should ideally come from plan or config
          }
        });

        // Record Initial Payment
        // Since PayPal subscription usually charges immediately or starts billing cycle
        // We'll record a payment record for history tracking
        // Note: For subscriptions, capture ID might not be available immediately in this flow unless we passed it.
        // If we don't have a transaction ID yet, we might skip creating Payment here and rely on Webhooks or Sync.
        // But for now, we'll log it if we can, or just rely on the Subscription record.
        // Let's create a 'PENDING' payment or skip it?
        // Better to wait for Webhook/Sync to create confirmed payments.
        // However, user expects to see something in history.
        // We can create a "Setup Fee" or "First Month" payment placeholder if we want.
        
        // Update User's current active plan pointer (optional, if we still use it for quick access)
        // But we are moving away from single fields.
        // We might still want to know "which plan is active for *this* user context" (e.g. limits).
        // Usually, we check `user.subscriptions.find(s => s.status === ACTIVE)`.
      }
    }

    // We need to pass status to the service or handle it there.
    // Since createProperty service takes validation.data which matches the schema roughly,
    // we might need to inject status into it.
    // Let's modify the service call or the service itself.
    // Checking service signature...
    let property = await propertyService.createProperty(
      {
        ...validation.data,
        status: initialStatus,
        published: false, // Always false initially, requires approval
      },
      session.user.id
    );
    // property = serializeDecimals(property);
    property = JSON.parse(JSON.stringify(property));
    revalidatePath("/properties");
    return { success: true, property };
  } catch (error) {
    console.error("Failed to create property:", error);
    // return { success: false, error: "Failed to create property." };
    return { success: false, error: String(error) };
  }
}
