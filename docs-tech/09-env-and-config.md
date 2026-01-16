# Environment & Config

## Environment Variables (.env)

| Variable | Purpose | Required? |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String | Yes |
| `NEXTAUTH_SECRET` | Session Encryption Key | Yes |
| `NEXTAUTH_URL` | Base URL (http://localhost:3000) | Yes |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Public ID | Yes (for payments) |
| `PAYPAL_CLIENT_SECRET` | PayPal Secret | Yes (for payments) |
| `BREVO_SMTP_*` | Email SMTP Config | Yes (for emails) |
| `NEXT_PUBLIC_CLOUDINARY_*` | Image Upload Config | Yes (for media) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Captcha Key | Yes (Prod) |

## Configuration Files
- `next.config.ts`: Next.js config (images domains, experimental flags).
- `tailwind.config.ts`: Tailwind theme customization.
- `package.json`: Dependencies and scripts.
