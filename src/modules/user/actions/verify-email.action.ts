"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function sendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return { error: "User not found" };

    // Invalidate previous tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate Verification Token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store in VerificationToken model
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    const subject = "Verify your email address - Dubai Estate";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Thanks for signing up for Dubai Estate! Please click the button below to verify your email address:</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If you didn't create an account, you can ignore this email.</p>
        <p>This link will expire in 30 minutes.</p>
      </div>
    `;

    await sendEmail({ to: email, subject, html });

    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { error: "Failed to send verification email" };
  }
}

export async function verifyEmailAction(token: string) {
  try {
    console.log("Verifying token:", token);
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    console.log("Token found in DB:", verificationToken);

    if (!verificationToken) {
      return { error: "Invalid token" };
    }

    if (new Date() > verificationToken.expires) {
      return { error: "Token expired" };
    }

    const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
    });

    if (!user) {
        return { error: "User not found" };
    }

    // Verify User
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true, message: "Email verified successfully!" };
  } catch (error) {
    console.error("Verification error:", error);
    return { error: "Verification failed" };
  }
}

export async function resendVerificationEmailAction(email: string) {
    // Simple rate limiting could be added here
    if (!email) return { error: "Email is required" };
    
    // Check if user is already verified?
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "User not found" };
    if (user.emailVerified) return { error: "Email already verified" };

    return await sendVerificationEmail(email);
}
