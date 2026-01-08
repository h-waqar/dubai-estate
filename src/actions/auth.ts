"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

// --- Register ---
export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const captchaToken = formData.get("cf-turnstile-response") as string;

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
        username: email.split("@")[0] + Math.floor(Math.random() * 1000), // Simple unique username logic
        phoneNumber: phone,
        password: hashedPassword,
        role: "USER",
        profile: {
          create: {},
        },
      },
    });

    // 6. Send Welcome Email (Async, don't block)
    await sendWelcomeEmail(user.email, user.firstName || "User");

    return { success: true, userId: user.id };
  } catch (err) {
    console.error("Registration Error:", err);
    return { error: "Failed to create user. Please try again." };
  }
}

// --- Forgot Password ---
export async function forgotPassword(email: string, captchaToken?: string) {
  // 1. Validate Captcha (Optional for forgot password, but good practice)
  const isCaptchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLE !== 'false';
  if (isCaptchaEnabled && captchaToken && (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) {
      const isCaptchaValid = await verifyTurnstile(captchaToken);
      if (!isCaptchaValid) {
        return { error: "CAPTCHA validation failed" };
      }
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success to prevent email enumeration, but don't send email
    return { success: true, message: "If an account exists, a reset link has been sent." };
  }

  // Generate Token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  // Send Email
  await sendPasswordResetEmail(user.email, token);

  return { success: true, message: "If an account exists, a reset link has been sent." };
}

// --- Reset Password ---
export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return { error: "Invalid or expired token" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { success: true };
}

// --- Update Profile ---
export async function updateProfile(userId: number, data: { firstName: string; lastName: string; phone: string; username: string }) {
  try {
    // Check if username is taken by another user
    if (data.username) {
        const existing = await prisma.user.findUnique({ where: { username: data.username } });
        if (existing && existing.id !== userId) {
            return { error: "Username is already taken" };
        }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        phoneNumber: data.phone,
        username: data.username,
      },
    });

    return { success: true, user };
  } catch (err) {
    console.error("Update Profile Error:", err);
    return { error: "Failed to update profile" };
  }
}
