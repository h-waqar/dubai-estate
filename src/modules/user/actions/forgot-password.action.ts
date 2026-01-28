"use server";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const captchaToken = formData.get("cf-turnstile-response") as string;

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

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Security: Don't reveal if user exists
      return { success: true, message: "If an account exists, a reset link has been sent." };
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires,
      },
    });

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
