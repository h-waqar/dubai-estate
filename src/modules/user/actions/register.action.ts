"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { sendVerificationEmail } from "@/modules/user/actions/verify-email.action";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("cf-turnstile-response") as string;
  const newsletter = formData.get("newsletter") === "on";

  // 1. Validate Captcha
  const isCaptchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLE !== 'false';
  if (isCaptchaEnabled && (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) {
    if (!captchaToken) {
      return { error: "Please complete the CAPTCHA" };
    }
    const isCaptchaValid = await verifyTurnstile(captchaToken);
    if (!isCaptchaValid) {
      return { error: "CAPTCHA validation failed" };
    }
  }

  // 2. Validate Inputs
  if (!email || !password || !firstName || !lastName) {
    return { error: "Missing required fields" };
  }

  // 3. Check Existing User
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "User already exists with this email" };
  }

  // 4. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create User
  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        username: email.split("@")[0] + "_" + Math.floor(Math.random() * 10000).toString(),
        phoneNumber: phone,
        password: hashedPassword,
        role: "USER",
        profile: {
          create: {},
        },
      },
    });

    // 6. Handle Newsletter Subscription
    if (newsletter) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { isActive: true },
        create: { email, isActive: true },
      });
      // TODO: Sync to Brevo Contacts API here if desired
    }

    // 7. Send Verification Email (Async)
    await sendVerificationEmail(user.email);

    return { success: true, userId: user.id, message: "Account created! Please verify your email." };
  } catch (err) {
    console.error("Registration Error:", err);
    return { error: "Failed to create user. Please try again." };
  }
}