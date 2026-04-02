import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dubai Estate - Find Your Dream Home",
  description: "Discover the finest properties across Dubai. Your trusted guide to Dubai's real estate market.",
  icons: {
    icon: "/assets/icons/favicon.svg",
    shortcut: "/assets/icons/favicon.svg",
    apple: "/assets/icons/favicon.svg",
  },
  robots: "noindex",
  verification: {
    google: "yXlV5iFSVaRIG0_CNU7wmjadooLjp0AvBcUFtnjny3Y",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <ClientThemeProvider>
            {children}
            <Toaster />
            <WhatsAppButton />
          </ClientThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
