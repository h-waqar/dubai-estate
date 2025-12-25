"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    className?: string;
}

export default function TurnstileWidget({ onSuccess, onError, className }: TurnstileWidgetProps) {
    const { theme } = useTheme();

    // Check if CAPTCHA is globally disabled
    // Note: ensure the env var is prefixed with NEXT_PUBLIC_ to be visible here
    const isEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLE !== 'false';

    if (!isEnabled) {
        return null;
    }

    return (
        <div className={className}>
            <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                options={{
                    action: "submit-form",
                    theme: theme === "dark" ? "dark" : "light",
                    appearance: "always", // or "interaction-only"
                    size: "normal" // "compact" if needed
                }}
                onSuccess={onSuccess}
                onError={onError}
            />
        </div>
    );
}
