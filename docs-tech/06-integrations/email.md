# Email Integration

## Provider
**Brevo (formerly Sendinblue)** via SMTP.

## Implementation
- **Library**: `nodemailer`.
- **File**: `src/lib/email.ts`.

## Configuration
Env vars required:
- `BREVO_SMTP_HOST`
- `BREVO_SMTP_PORT`
- `BREVO_SMTP_USER`
- `BREVO_SMTP_PASSWORD`
- `SENDER_EMAIL`

## Transactional Emails
1.  **Welcome Email**: Sent on registration.
2.  **Password Reset**: Sent on forgot password request.
    - Generates a token (valid 1 hour).
    - Links to `/reset-password?token=...`.
