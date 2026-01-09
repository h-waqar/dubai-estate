# Email System Implementation Plan

## 1. Diagnostics & Troubleshooting
- [ ] **Verify Credentials:** Ensure `BREVO_SMTP_USER` and `BREVO_SMTP_PASSWORD` are correct in `.env`.
- [ ] **Fix Configuration:** Correct typos in `docker-compose.yml` (Found: `REVO_SMTP_PORT` -> `BREVO_SMTP_PORT`, `REVO_SMTP_PASSWORD` -> `BREVO_SMTP_PASSWORD`).
- [ ] **Test Script:** Create `src/scripts/test-email.ts` to verify SMTP connection in isolation.

## 2. Configuration Requirements
To send emails via Brevo (Sendinblue), the following environment variables are required:

```env
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-login-email@example.com
BREVO_SMTP_PASSWORD=your-smtp-key-not-login-password
SENDER_NAME="Dubai Estate"
SENDER_EMAIL=admin@dubaiestateguide.com  # Must be verified in Brevo
```

## 3. Implementation Plan

### Step 1: Fix Docker Configuration
- Update `docker-compose.yml` to correctly pass all Brevo variables.
- **Action:** Apply fixes to `docker-compose.yml`.

### Step 2: Create Test Script
- Create a standalone script to test email sending without the full app overhead.
- **Action:** Create `src/scripts/test-email.ts`.

### Step 3: Verify & Restart
- User needs to restart Docker to apply changes.
- Run the test script inside the container.

### Step 4: Integration
- Ensure `src/lib/email.ts` uses the correct variables (already done).
- Verify `forgot-password.action.ts` and `register.action.ts` use the email utility correctly.

## 4. Brevo Specifics
- **SMTP Key:** This is DIFFERENT from the API Key. It must be generated in Brevo Dashboard -> SMTP & API -> SMTP Tab -> Generate new SMTP key.
- **Verified Sender:** `SENDER_EMAIL` must be a verified sender in Brevo.

## 5. Fallback Strategy
- If SMTP fails consistently on localhost (due to ISP blocking port 587), switch to Brevo API (HTTP) instead of SMTP.
- This requires installing `sib-api-v3-sdk` or simply using `fetch` to call Brevo's email API endpoint.
