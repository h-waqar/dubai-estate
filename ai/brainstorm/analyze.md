/sg:analyze
Payment & Billing System Analysis Report

1. Payment Flow Discovery

Subscriptions (Recurring)

- Creation: Handled entirely on the client-side using @paypal/react-paypal-js components (PayPalSubscriptionModal.tsx).
- Pricing: Calculated dynamically on the client based on the selected plan's priceMonthly and any active coupon from useCouponStore.
- Discount Application:
  - If a coupon is valid, the frontend modifies the createSubscription payload to inject a custom pricing_scheme with the discounted fixed price.
  - The coupon code is embedded into the custom_id field of the PayPal subscription metadata.
- Activation:
  - Upon successful client-side approval (onApprove), the activateSubscription server action is called with the subscriptionID.
  - The backend fetches subscription details from PayPal API (v1/billing/subscriptions).
  - It parses custom_id to retrieve the applied coupon code.
  - It re-validates the coupon and re-calculates the priceAtSubscription locally before storing it.
  - A Subscription record is upserted, and the User record is updated to reflect the active plan.

Project Listings (One-Time)

- Creation: Handled in StepNinePayment.tsx.
- PayPal: Uses createOrder with intent: "CAPTURE" and client-side capture.
  - Critical Gap: The backend createProjectAction does not verify that a payment occurred. It blindly accepts the project submission.
- Credit Card:
  - Fake Implementation: The UI collects sensitive card data (Name, Number, Expiry, CVV).
  - Data Leak: This raw data is sent to the server action (createProjectAction).
  - No Processing: The server action completely ignores these fields. No payment processor is integrated. No charge is made.
- Pay Later: Merely submits the form without any financial interaction.

2. Ledger & Data Authority Audit

- Internal Ledger: Non-Existent.
  - The Payment model exists in the Prisma schema but is never populated.
  - There is zero record of individual transactions (success/failure/refunds) in the database.
- Data Authority:
  - PayPal: Is the sole source of truth for transaction history.
  - Local DB: Subscription table only stores the current state (status, dates, price at start).
- History Gap: It is impossible to reconstruct a payment history or generate invoices reliably using only the local database.

3. PayPal Dependency Analysis

- APIs Used:
  - v1/billing/subscriptions (Get details, Cancel)
  - v1/billing/plans (Create, List)
  - v1/catalogs/products (Create)
  - v1/oauth2/token (Auth)
- Webhooks: Missing.
  - No webhook handlers exist in the codebase.
  - Consequence: The system is unaware of external events such as:
    - Subscription cancellations made via PayPal dashboard.
    - Payment failures (dunning).
    - Refunds or disputes.
- Admin Visibility: Admins must rely entirely on the PayPal dashboard to view actual transaction flows.

4. Coupon & Pricing Behavior

- Application Logic: Hybrid (Client + Server).
  - Client calculates visual price.
  - Client tells PayPal what to charge (via override).
  - Server validates coupon validity during activation using custom_id.
- Risks:
  - Persistence: The discounted price is "baked in" to the subscription at creation. If the plan price changes later, the user remains on the old/discounted price until
    cancellation (standard PayPal behavior, but noteworthy).
  - Project Listings: Coupons are not currently implemented for the one-time project listing flow.

5. Domain Coverage

┌────────────────────┬────────────────────────────┬──────────────────────────────────────────────────────────────┐
│ Feature │ Payment Logic │ Status │
├────────────────────┼────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ User Subscriptions │ PayPal Subscription │ ✅ Functional (with Ledger/Webhook gaps) │
│ Project Listing │ PayPal Capture / Fake Card │ ⚠️ Insecure (No verification, Fake Card UI) │
│ Advertise/Media │ Unknown │ Likely missing or shares Project logic │
│ Property Listing │ N/A │ Logic appears tied to Subscription limits, not per-item fees │
└────────────────────┴────────────────────────────┴──────────────────────────────────────────────────────────────┘

Open Questions

- How are refunds handled? (Code exists in paypal-api.ts but is not wired to UI).
- Is there any manual reconciliation process currently used by admins?
- Are there compliance issues with collecting (even if ignoring) raw credit card data without PCI compliance? (Yes, highly likely).

Component Inventory

- Services: paypal-api.ts (API wrapper), coupon.service.ts.
- Actions: activateSubscription, createProjectAction (Project), coupon.ts (CRUD).
- UI Components: PayPalSubscriptionModal (Sub), StepNinePayment (Project).
- Stores: useCouponStore, useProjectAdvertiseStore.

---

/sg:analyze
Payment & Billing System Analysis Report (Phase 2)

1. Refund Capability & Gaps (PayPal-Centric)

Current State: Hidden but Functional

- Workflow: A functional refund workflow exists but is buried deep in the UI:
  - Admin > Subscribers > [Three-dot Menu] > "View Transactions" > Modal opens.
  - This modal fetches live data from PayPal (v1/billing/subscriptions/{id}/transactions).
  - A "Refund" button triggers refundUserTransaction (Server Action) -> refundPayment (PayPal API).
- Technical Implementation:
  - Uses paypal-api.ts to call POST /v2/payments/captures/{captureId}/refund.
  - Requires captureId, which is obtained dynamically from the transaction list.
- Risks & Gaps:
  - Data Ephemerality: Refund history exists only in PayPal. If the PayPal account changes or API keys break, all record of refunds is lost to the admin dashboard.
  - No Audit Trail: The local database (Payment table) is empty. There is no record of who performed the refund or when.

2. Admin Finance Surface Area Audit

Existing Views

- Revenue Page (`/admin/revenue`):
  - Status: Misleading / Fake.
  - Logic: Calculates SUM(Plan Price \* Active User Count).
  - Reality: This is a "Run Rate" projection, not Revenue. It ignores:
    - Refunds.
    - Failed payments (dunning).
    - Coupons (it uses the base plan price).
    - One-time project listing fees.
- Subscribers Page (`/admin/subscribers`):
  - Status: Functional list of Subscription models.
  - Logic: Fetches local DB records.
  - Gaps: Shows status, but no payment history unless you click into the "View Transactions" modal.

Missing Views

- Transactions/Ledger: Does not exist.
- Invoices: Does not exist.
- Project Payments: No view exists to see who paid for a project listing.

3. Reconciliation Reality Check

Feasibility: Impossible (Currently)

- Local Data: The Payment table is defined in Prisma but never populated. The Subscription table tracks current status but not payment events.
- PayPal Data: Complete, but isolated.
- Conclusion: You cannot reconcile because there is no "left side" of the equation (local ledger) to compare with the "right side" (PayPal).
- Hybrid Option: Theoretically, one could fetch all PayPal transactions and "backfill" the ledger, but there is no scheduled job or script to do this.

4. Payment Integrity & Trust Boundaries

🚨 Critical Vulnerability: Project Listings

- Flow: StepNinePayment.tsx -> createProjectAction.ts.
- PayPal Method:
  - Client performs actions.order.capture().
  - Client calls createProjectAction on success.
  - Vulnerability: The server action does not verify the transaction. A malicious user can call createProjectAction directly without paying.
- Credit Card Method:
  - Fake & Dangerous. (See Section 5).
- Pay Later Method:
  - Explicitly bypasses payment.
- Data Authority: The Backend trusts the Client 100%.

Subscriptions

- Flow: PayPalSubscriptionModal -> activateSubscription.ts.
- Verification: Stronger. The backend takes the subscriptionID, calls PayPal API to verify status (ACTIVE), and checks the plan.
- Trust Score: High.

5. Bogus Credit Card Code Audit (PCI Risk)

⚠️ Urgent Compliance Risk

- Component: StepNinePayment.tsx (Card Form).
- Behavior:
  - Collects Raw PAN (Card Number), CVV, Expiry, and Name in React State.
  - Uses zod to validate length and format.
  - Outcome: The onSubmit handler discards this data. It is not sent to the server.
- Risk Assessment:
  - PCI-DSS: Collecting raw card data on a non-compliant form (even if not transmitted) is a massive security and compliance red flag.
  - Phishing: It looks exactly like a phishing form to a security auditor (collecting data -> doing nothing).
  - Safety: Removing this code is safe and mandatory. It is dead code that only introduces liability.

6. Cross-Domain Consistency Check

┌─────────────────┬────────────────┬────────────────────┬───────────────┬─────────────────┐
│ Domain │ Payment Method │ Verification │ Ledger Record │ Status │
├─────────────────┼────────────────┼────────────────────┼───────────────┼─────────────────┤
│ Subscriptions │ PayPal Sub │ ✅ Server-Verified │ ❌ None │ OK (No History) │
│ Project Listing │ PayPal Capture │ ❌ Client-Trusted │ ❌ None │ Insecure │
│ Project Listing │ Credit Card │ ❌ Fake │ ❌ None │ Liability │
└─────────────────┴────────────────┴────────────────────┴───────────────┴─────────────────┘

Updated Open Questions

- Refunds: We confirmed they work technically via PayPal API, but is the Admin actually using this hidden feature?
- Legacy Data: Are there existing active subscriptions in PayPal that are not in the local DB? (Since we only sync on activation).
- Project Fees: Since project payments are unverified, how much revenue has actually been lost to "fake" submissions?

Recommendation Summary (For Architecture Phase)

1.  Kill the Fake Card Form immediately.
2.  Implement a Ledger (Payment table) to store every PayPal webhook event.
3.  Verify Project Payments server-side (pass Order ID, verify Capture status).
4.  Deprecate "Revenue Page" until it reads from the Ledger.

---

/sg:analyze
Final System-Level Analysis: Payment & Billing

1. Pricing Plan Architecture (Current & Future)
   Current State

- Definition: Plans are hybrid entities defined partly in the DB (PricingPlan model) and partly in hardcoded UI constants (PricingCard.tsx).
- Coupling: The system is tightly coupled to PayPal Subscription IDs. The PricingPlan model stores paypalPlanId, and the frontend (PayPalSubscriptionModal) relies on
  environment variables (NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD) to map slugs to PayPal IDs. [comment: We were using this in older versions now its not being used at all the paypal stores are being generated automatically right now in the subscriptions pricing plans]
- Differentiation:
  - User Plans: Recurring subscriptions handled via activateSubscription.
  - Project Plans: Handled as one-time fees (priceOneTime) or "Pay Later". The PricingPlan model attempts to cover both via a type enum (SUBSCRIPTION | ONE_TIME), but
    StepNinePayment.tsx ignores the DB plan logic entirely, relying on a prop (projectPlan) or defaults.

Future Risk

- Hardcoded Features: Feature entitlements (e.g., "Priority Support") are hardcoded in React components, not database-driven. This prevents dynamic plan creation without code
  deployment.
- Project vs. Property: The current schema handles "Projects" as a distinct entity but has no clear path for "Property" pricing (which seems to be an entitlement of the User
  Subscription). Expanding to pay-per-property would require a refactor.

2. Refactor Readiness – Unified Pricing Model
   Readiness Score: Low

- Unified Model: The system lacks a "Product" abstraction. It treats "Plans" as the atomic unit.
- Add-ons: There is zero infrastructure for add-ons.
  - Implementation Strategy: Add-ons should be modeled as Product entities (ledger-only or PayPal one-time products).
  - Risk: Adding add-ons now would require hacking StepNinePayment.tsx or PricingCard.tsx, increasing technical debt.
- Verification:
  - Current: Client-side trust for Projects (Critical Vulnerability).
  - Required: Server-side verification of all line items (Base Plan + Add-ons) before provisioning.

3. Subscription Lifecycle Integrity
   State Consistency: Fragile

- PayPal <-> DB: Sync happens only at activation (activateSubscription) or manual admin sync (SubscriptionActions).
- Drift: Since there are no webhooks, if a user cancels via PayPal or a payment fails, the local DB remains ACTIVE. The user retains access indefinitely until an admin
  manually checks.
- Transitions:
  - REFUNDED: Does not exist in local state.
  - CANCELLED: Exists but rarely triggered automatically.
  - EXPIRED: Exists but never set automatically.

Refund Workflow

- Process: User clicks "Request Refund" -> Email is sent to support.
- Admin Action: Admin must go to "Subscribers", find the hidden "View Transactions" modal, and click Refund.
- Gap: The refund happens in PayPal, but the Subscription status in DB does not automatically change to CANCELLED or REFUNDED (unless the admin manually cancels it
  separately).

4. Account Dashboard UX & Data Authority
   Findings

- Sidebar: Clear distinction (Account, Billing, My Content).
- Subscriptions Page (`/account/subscriptions`): Functional. Shows local DB state.
  - Issue: Displays "Active" even if payment failed (due to lack of webhooks).
- Payment History Page (`/account/subscriptions/history`): BROKEN / FAKE.
  - Logic: It calls getMyTransactions, which queries the local Payment table.
  - Reality: The Payment table is empty (never populated).
  - Crash Risk: The UI code expects PayPal API objects (amount_with_breakdown) but the Server Action returns Prisma objects (which don't have that field). If/when the
    Payment table is populated, this page will crash.

5. Ledger Readiness Check
   Status: Critical Missing Piece
   The system is currently operating without a financial brain.

┌──────────────────────┬───────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────┐
│ Event Type │ Current Handling │ Ledger Requirement │
├──────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────┤
│ Subscription Sign-up │ activateSubscription updates User/Sub status. │ Must record `Payment` entry with Transaction ID. │
│ Recurring Payment │ Ignored (No Webhook). │ Must record `Payment` entry via Webhook (PAYMENT.SALE.COMPLETED). │
│ Project Listing │ Ignored (Client-side trust). │ Must record `Payment` entry and link to Project. │
│ Refund │ Admin UI -> PayPal API directly. │ Must record `Payment` (negative) entry via Webhook (PAYMENT.CAPTURE.REFUNDED). │
│ Dispute │ Ignored. │ Must record `Dispute` entry via Webhook. │
└──────────────────────┴───────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────┘

Immediate Recommendations

1.  Fix Payment History: Rewrite the page to handle the "empty" state gracefully or remove it until the Ledger is active.
2.  Implement Webhooks: This is non-negotiable for a subscription business. You need BILLING.SUBSCRIPTION._ and PAYMENT.SALE._ events.
3.  Kill Fake Project Payment: Enforce server-side verification for Project creation.
