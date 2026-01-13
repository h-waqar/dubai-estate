# PayPal Implementation Workflow

## 1. Overview
We have integrated PayPal into the Dubai Estate application for:
1.  **Property Listings (`/advertise`)**: Recurring monthly subscriptions (Silver/Gold packages).
2.  **Project Listings (`/advertise/project`)**: One-time listing fee ($100).

## 2. Configuration

### Environment Variables
The following variables are required in `.env`:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID="<SANDBOX_OR_LIVE_CLIENT_ID>"
PAYPAL_CLIENT_SECRET="<SANDBOX_OR_LIVE_SECRET>"
NEXT_PUBLIC_PAYPAL_SANDBOX="true" # Set to false for Live
NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER="<GENERATED_PLAN_ID>"
NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD="<GENERATED_PLAN_ID>"
```

### Script: `init-paypal.ts`
This script initializes the PayPal Products and Plans.
-   **Location**: `src/scripts/init-paypal.ts`
-   **Usage**: `npx tsx src/scripts/init-paypal.ts`
-   **Output**: Prints the Plan IDs needed for the `.env` file.
-   **Note**: Run this once (or whenever you need to recreate plans, e.g., switching from Sandbox to Live).

## 3. Implementation Details

### Property Listings (Recurring)
-   **File**: `src/modules/property/components/advertise/steps/StepSixPayment.tsx`
-   **Logic**:
    -   Uses `PayPalScriptProvider` with `intent: "subscription"` and `vault: true`.
    -   Uses `PayPalButtons` with `createSubscription`.
    -   Selects the Plan ID based on the user's choice (Gold/Silver).
    -   On approval, calls `onSubmit` with `paymentMethod: "paypal"`.

### Project Listings (One-Time)
-   **File**: `src/modules/project/components/advertise/steps/StepNinePayment.tsx`
-   **Logic**:
    -   Uses `PayPalScriptProvider` with `intent: "capture"`.
    -   Uses `PayPalButtons` with `createOrder`.
    -   Charges a fixed fee ($100).
    -   On approval, calls `onSubmit` with `paymentMethod: "paypal"`.

## 4. How to Test

### Prerequisites
-   Ensure `NEXT_PUBLIC_PAYPAL_SANDBOX="true"` in `.env`.
-   Use a **PayPal Sandbox Buyer Account** (create one in PayPal Developer Dashboard).

### Test Property Subscription
1.  Go to `/advertise`.
2.  Fill in the form until Step 6 (Payment).
3.  Select "PayPal".
4.  Click the PayPal button.
5.  Log in with Sandbox Buyer credentials.
6.  Agree to the subscription.
7.  Verify you are redirected/shown a success message.
8.  Check the "Admin Dashboard" or Database to see the new property.

### Test Project Payment
1.  Go to `/advertise/project`.
2.  Fill in the form until Step 9 (Payment).
3.  Select "PayPal".
4.  Click "Pay Now" (or PayPal button).
5.  Log in with Sandbox Buyer credentials.
6.  Complete the payment.
7.  Verify success message.

## 5. Troubleshooting
-   **"Missing Plan ID"**: Ensure you ran `init-paypal.ts` and updated `.env`.
-   **"Invalid Client ID"**: Check `.env` and restart the server.
-   **"Currency not supported"**: Ensure your PayPal Sandbox account supports USD.
-   **Subscription fails**: Ensure `vault: true` is passed to `PayPalScriptProvider`.

## 6. Future Improvements
-   **Webhooks**: Implement PayPal Webhooks to handle recurring payment success/failure events (e.g., cancel subscription if payment fails).
-   **Transaction Storage**: Update the database schema to store `subscriptionID` or `orderID` for better reconciliation.
