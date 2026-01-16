# Payments

## Provider
**PayPal** is the primary payment provider.

## Implementation
- **Library**: `@paypal/react-paypal-js` (Frontend), `axios` (Backend).
- **File**: `src/lib/paypal-api.ts`.

## Key Features
1.  **Product Creation**: Automates creating "Products" in PayPal Catalog API.
2.  **Plan Creation**: Automates creating Billing Plans in PayPal API.
3.  **Subscription Management**:
    - `getSubscriptionDetails`: Validates status (ACTIVE/SUSPENDED).
    - `cancelSubscription`: Cancels recurring billing on PayPal.
4.  **Refunds**: Supports refunding captured payments via `refundPayment`.

## Configuration
Requires environment variables:
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_SANDBOX` (true/false)
