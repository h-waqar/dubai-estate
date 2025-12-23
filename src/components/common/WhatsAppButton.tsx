"use client";

import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
    const phoneNumber = "971582634980";
    const message = encodeURIComponent("Hello! I'm interested in your properties.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-6 right-6 z-50",
                "flex items-center justify-center",
                "w-14 h-14 rounded-full",
                "bg-[#25D366] text-white",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300 hover:scale-110",
                "animate-bounce-slow" // Custom animation class or just hover effects
            )}
            aria-label="Contact us on WhatsApp"
        >
            <FaWhatsapp className="w-8 h-8" />

            {/* Pulse Effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
        </a>
    );
}
