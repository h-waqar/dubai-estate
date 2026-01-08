# Environment Variables

## Database
DATABASE_LOCAL_URL="postgresql://user:password@localhost:5432/dubai_estate?schema=public"

## NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"

## Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

## Email (Brevo / SMTP)
BREVO_SMTP_HOST="smtp-relay.brevo.com"
BREVO_SMTP_PORT="587"
BREVO_SMTP_USER="your-brevo-login-email"
BREVO_SMTP_PASSWORD="your-brevo-smtp-key"
SENDER_EMAIL="no-reply@dubaiestate.com"
SENDER_NAME="Dubai Estate"

## Cloudinary (Media)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset"

## Turnstile (Captcha)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-site-key"
TURNSTILE_SECRET_KEY="your-secret-key"
PUBLIC_CAPTCHA_ENABLE="true"
