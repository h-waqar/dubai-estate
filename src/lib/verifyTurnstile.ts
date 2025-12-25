export async function verifyTurnstile(token: string) {
    // Respect the global disable toggle
    // If explicitly set to 'false', we skip verification and allow the request.
    if (process.env.PUBLIC_CAPTCHA_ENABLE === 'false') {
        return true;
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
        console.warn("TURNSTILE_SECRET_KEY is not defined");
        // In dev/localhost, maybe we want to allow skipping if key is missing?
        // Better to fail safe.
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('secret', secretKey);
        formData.append('response', token);

        // Optional: Add remoteip if available, but tricky in Next.js server actions sometimes without headers() helper
        // formData.append('remoteip', ip); 

        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const outcome = await result.json();
        return outcome.success;
    } catch (err) {
        console.error("Turnstile verification error:", err);
        return false;
    }
}
