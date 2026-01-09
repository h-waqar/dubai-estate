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

    // Generate Verification Token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // We can reuse the VerificationToken model or add a verificationToken field to User.
    // The Schema has a VerificationToken model:
    // model VerificationToken {
    //   identifier String
    //   token      String   @unique
    //   expires    DateTime
    //   @@unique([identifier, token])
    // }
    // It's usually for NextAuth magic links, but we can reuse it or use a custom field.
    // Given the previous schema discussion, let's use the standard VerificationToken model to be cleaner
    // OR we can add `verificationToken` to User if we want simplicity.
    // Let's check schema again. `User` doesn't have `verificationToken`.
    // But `VerificationToken` model exists. Let's use that.

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    const subject = "Verify your email address - Dubai Estate";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Thanks for signing up for Dubai Estate! Please click the button below to verify your email address:</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If you didn't create an account, you can ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
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
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

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
