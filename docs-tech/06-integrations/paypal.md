# PayPal Integration

## Purpose
Handles subscription billing and payments for the platform.

## Architecture
- **Client-Side**: `@paypal/react-paypal-js`
    - Renders the "PayPal Buttons".
    - Handles the user approval flow.
    - Calls `createSubscription` and `onApprove`.
- **Server-Side**: `src/lib/paypal-api.ts`
    - Uses Client Credentials Auth flow to get an Access Token.
    - Manages Plans and Products.
    - Verifies Subscription status.

## Key Files
- `src/lib/paypal-api.ts`: API Wrapper.
- `src/app/(frontend)/pricing/page.tsx`: Plan selection UI.
- `src/modules/pricing/actions`: Server actions interacting with PayPal.

## Webhooks
*⚠️ Status: Unknown/Not Found in analysis.*
Webhooks would typically be at `src/app/api/webhooks/paypal`, but were not explicitly identified in the route map. Ensure polling or manual verification is used if webhooks are absent.
