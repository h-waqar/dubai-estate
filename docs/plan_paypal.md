# PayPal Integration Plan

## 1. Overview
We will integrate PayPal for handling payments in two main areas:
1.  **Property Listings (`/advertise`)**: Recurring monthly subscriptions (Gold/Silver packages).
2.  **Project Listings (`/advertise/project`)**: One-time listing fee payments.

## 2. Credentials & Configuration
We will use the credentials provided in `@docs/paypal.md`.
A new environment variable `NEXT_PUBLIC_PAYPAL_SANDBOX` will control the mode.

### Environment Variables (`.env`)
```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID="<ID_FROM_DOCS>"
PAYPAL_CLIENT_SECRET="<SECRET_FROM_DOCS>"
NEXT_PUBLIC_PAYPAL_SANDBOX="true" # Set to false for Live

# Plan IDs (Generated via script)
NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER=""
NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD=""
```

## 3. Implementation Steps

### Step 1: Environment Setup
-   Update `.env` with the credentials from `@docs/paypal.md`.
-   Implement the logic to switch between Sandbox/Live endpoints based on `NEXT_PUBLIC_PAYPAL_SANDBOX`.

### Step 2: PayPal Plan Initialization Script
Since `/advertise` requires recurring payments, we need to create "Billing Plans" in PayPal.
We will create a script `src/scripts/init-paypal.ts` to:
1.  Authenticate with PayPal API (using Client ID/Secret).
2.  Create a "Product" (Dubai Estate Listing).
3.  Create two "Plans":
    -   **Silver**: $10/month
    -   **Gold**: $25/month
4.  Output the `PLAN_ID`s to be added to `.env`.

### Step 3: Refactor Property Payment (`StepSixPayment.tsx`)
-   **Current**: Uses `createOrder` (One-time).
-   **New**: Switch to `createSubscription`.
-   **Logic**:
    -   Check selected plan (gold/silver).
    -   Pass the corresponding `plan_id` from env to PayPal button.
    -   Handle `onApprove` for subscriptions (capture `subscriptionID`).

### Step 4: Refactor Project Payment (`StepNinePayment.tsx`)
-   **Current**: Uses `createOrder` (One-time).
-   **New**: Ensure it uses the correct Client ID.
-   **Logic**: Keep as one-time payment (Capture) but ensure it respects the Sandbox toggle.

### Step 5: PayPal Provider Wrapper
-   Ensure `PayPalScriptProvider` is correctly configured with the `clientId` and `vault: true` (needed for subscriptions) in `StepSixPayment`.

## 4. Verification
-   Run the initialization script to get Plan IDs.
-   Test `/advertise` flow:
    -   Select Plan -> PayPal -> Subscribe.
    -   Verify redirection/success message.
-   Test `/advertise/project` flow:
    -   PayPal -> Pay Now.
    -   Verify success.

## 6. Dynamic Plan Management (Implemented)

We have implemented a dynamic pricing system to manage plans from the Admin Dashboard.

### Features
1.  **Admin Panel**:
    -   Manage Plans: `/admin/pricing` (Create, Edit, Delete).
    -   Types: `SUBSCRIPTION` (Monthly/Yearly) and `ONE_TIME` (for Projects).
    -   View Subscribers: `/admin/subscribers` (List of active payers).

2.  **Frontend Integration**:
    -   **Property Listing (`/advertise`)**: Fetches active `SUBSCRIPTION` plans dynamically.
    -   **Project Listing (`/advertise/project`)**: Fetches the active `ONE_TIME` plan dynamically.

### Next Steps for Deployment
1.  **Database Migration**: Run `npx prisma migrate deploy` to apply the new schema changes (added `PlanType` and `priceOneTime`).
2.  **Create Plans**:
    -   Go to `/admin/pricing/new`.
    -   Create "Silver" and "Gold" plans (Subscription).
    -   Create "Project Listing" plan (One-Time).
3.  **PayPal Sync**: Ensure the `slug` or ID of the created plans matches what is used in the PayPal initialization script if strict mapping is required. Currently, the frontend uses the plan details from the DB to display prices, but the PayPal interaction still needs the `PLAN_ID` from environment variables for Subscriptions.

### Todo
-   [ ] Run `npx prisma migrate dev` (or deploy) on the production DB.
-   [ ] Populate the plans in the Admin Dashboard.
-   [ ] Verify the PayPal `plan_id` mapping in `StepSixPayment`.
