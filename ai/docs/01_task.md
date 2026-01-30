# Task 01: Implement Strong Password Handling and Security

## What Was Done
- Enforced strong password rules (12+ chars, uppercase, lowercase, number, special char).
- Implemented `PasswordInput` component with live tooltip checklist and strength meter (entropy-based).
- Updated `/register`, `/reset-password`, and `/login` pages to use the new component.
- Secured Login page with `autoComplete="new-password"` to prevent prefill.
- Added server-side Zod validation for passwords in all auth actions.

## Files Modified/Created
- `src/validators/password.validator.ts`: Created shared Zod schema.
- `src/components/auth/PasswordInput.tsx`: Created new UI component.
- `src/app/(frontend)/(auth)/register/page.tsx`: Replaced input, enabled strength meter.
- `src/app/(frontend)/(auth)/reset-password/page.tsx`: Replaced inputs, enabled strength meter.
- `src/app/(frontend)/(auth)/login/page.tsx`: Replaced input, set autocomplete, disabled strength meter.
- `src/modules/user/actions/register.action.ts`: Updated validation.
- `src/modules/user/actions/reset-password.action.ts`: Updated validation.
- `src/modules/user/actions/change-password.action.ts`: Updated validation.

## Functions/Components Written
- `PasswordInput`: Handles visibility toggle, entropy calculation, and tooltip rendering.
- `passwordSchema`: Zod schema for validation.

## Key Decisions
- Created a shared validator to ensure consistency between client and server.
- Built a custom `PasswordInput` to avoid external dependencies for strength estimation (using simple entropy logic).
- Used `autoComplete="new-password"` on login to strictly follow the "no prefill" requirement, although it might affect UX for password managers.

## Testing Considerations
- Validated that short or simple passwords are rejected on both client (visual) and server.
- Checked that the tooltip appears on focus and updates live.
- Verified that the login password field does not autofill (dependent on browser behavior).
