# System Design: Ledger-Centric Billing, Entitlements & Listing Governance (Refined)

## 1. Executive Summary

This design shifts the Dubai Estate marketplace from a "PayPal-reactive" system to a **Ledger-First** architecture. 

**Core Principle:** *Money is not truth. The Ledger is truth.* 
No subscription renewal, entitlement grant, or listing state change occurs without a preceding, immutable `LedgerTransaction`.

**Key Design Decisions:**
1.  **Ledger Domain:** The single source of truth for all financial events.
2.  **Entitlement Domain:** Decouples billing (Subscription) from access (Entitlement). Subscriptions do not control listings; they grant entitlements.
3.  **Tri-State Governance:** Deterministic visibility logic based on **Editorial** (User), **Moderation** (Admin), and **System** (Quota/Billing) states.

---

## 2. High-Level Architecture

```ascii
                                   +-------------------+
                                   |   Admin Console   |
                                   +---------+---------+
                                             | (Refund/Adjust)
                                             v
+----------------+    +------------+    +----+-------+    +------------------+
| PayPal Webhook | -> | Ledger Svc | -> | Sub Svc    | -> | Entitlement Svc  |
+----------------+    +-----+------+    +------------+    +--------+---------+
                            |                                      |
      (Source of Truth)     v                                      v
                      +-----+------+                       +-------+----------+
                      | Ledger DB  |                       | Listing Gov. Svc |
                      +------------+                       +------------------+
```

### Domain Boundaries

1.  **Ledger Domain (`modules/finance`)**
    *   **Responsibility:** Immutable recording of payments, refunds, and disputes.
    *   **Constraint:** Only Webhooks or Verified Server Actions can write here. Client input is untrusted.
    *   **Output:** `LedgerTransaction` records.

2.  **Subscription Domain (`modules/subscription`)**
    *   **Responsibility:** Lifecycle management (Active, Past Due, Cancelled).
    *   **Logic:** Reacts to Ledger events to transition state.
    *   **Output:** Triggers `EntitlementService.grant()` or `revoke()`.

3.  **Entitlement Domain (`modules/entitlement`)**
    *   **Responsibility:** Managing "What a user owns" vs "What exists".
    *   **Model:** Split into `EntitlementDefinition` (The "Product") and `EntitlementGrant` (The "User Asset").
    *   **Logic:** Capacity checks and expiration logic.

4.  **Listing Governance Domain (`modules/governance`)**
    *   **Responsibility:** Enforcing visibility rules.
    *   **Logic:** Tri-State Machine.
    *   **Rule:** `Visible = Editorial(SUBMITTED) AND Moderation(APPROVED) AND System(ACTIVE)`.

---

## 3. Data Model (Prisma Schema Recommendations)

### A. The Ledger (Financial Truth)

```prisma
model LedgerTransaction {
  id              String            @id @default(uuid())
  userId          Int
  
  type            TransactionType   // PAYMENT, REFUND, DISPUTE, CREDIT
  status          TransactionStatus // PENDING, COMPLETED, FAILED
  amount          Decimal           @db.Decimal(10, 2)
  currency        String            @default("USD")
  
  // Idempotency & Traceability
  provider        String            // "PAYPAL"
  providerTxId    String            @unique // Capture ID / Refund ID
  providerOrderId String?           // Order ID
  
  description     String?
  metadata        Json?             // Raw webhook payload
  
  occurredAt      DateTime          // Event time from Provider
  createdAt       DateTime          @default(now())
  
  user            User              @relation(fields: [userId], references: [id])
}
```

### B. Entitlement System (The Decoupler)

```prisma
// What exists (Static configuration)
model EntitlementDefinition {
  id              String   @id @default(cuid())
  code            String   @unique // PROPERTY_SLOT, PROJECT_SLOT, FEATURED_BOOST
  description     String?
  
  grants          EntitlementGrant[]
}

// What a user owns (Dynamic state)
model EntitlementGrant {
  id              String   @id @default(cuid())
  userId          Int
  definitionId    String
  
  // Constraints
  capacity        Int?     // For slots (e.g., 5)
  used            Int      @default(0) 
  
  // Validity
  validFrom       DateTime @default(now())
  validTo         DateTime? // Null = Lifetime
  
  // Lineage
  sourceType      String   // "SUBSCRIPTION", "ADD_ON"
  sourceId        String   // Subscription.id or Order.id
  
  status          GrantStatus @default(ACTIVE) // ACTIVE, EXPIRED, REVOKED
  
  definition      EntitlementDefinition @relation(fields: [definitionId], references: [id])
  user            User                  @relation(fields: [userId], references: [id])
  
  @@index([userId, status])
}
```

### C. Tri-State Listing Governance

```prisma
model Property {
  // ...
  
  // 1. Editorial (User)
  editorialStatus   EditorialStatus @default(DRAFT) // DRAFT, SUBMITTED, ARCHIVED
  
  // 2. Moderation (Admin)
  moderationStatus  ModerationStatus @default(PENDING_REVIEW) // PENDING, APPROVED, REJECTED, SUSPENDED
  
  // 3. System (Billing/Quota)
  systemStatus      SystemStatus     @default(ACTIVE) // ACTIVE, INACTIVE_BILLING, INACTIVE_QUOTA
}
```

---

## 4. Interaction Flows

### Flow A: Subscription Purchase (Secure)
1.  **Client:** Completes PayPal checkout.
2.  **Server Action:** Receives `subscriptionID`.
3.  **Verification:** Calls PayPal API to verify status is `ACTIVE`.
4.  **Ledger:** Creates `LedgerTransaction` (PAYMENT, COMPLETED).
5.  **Subscription:** Creates/Updates `Subscription` record.
6.  **Entitlement:** Creates `EntitlementGrant` (Type: PROPERTY_SLOT, Capacity: Plan Limit).

### Flow B: Recurring Renewal (Webhook)
1.  **PayPal:** Sends `PAYMENT.SALE.COMPLETED` webhook.
2.  **Handler:** Verifies signature & idempotency (`providerTxId`).
3.  **Ledger:** Writes `LedgerTransaction`.
4.  **Subscription:** Extends `nextBillingDate`.
5.  **Entitlement:** Extends `validTo` on associated Grants.

### Flow C: Payment Failure / Cancellation
1.  **PayPal:** Sends `PAYMENT.SALE.DENIED` or `BILLING.SUBSCRIPTION.CANCELLED`.
2.  **Ledger:** Writes `LedgerTransaction` (FAILED/INFO).
3.  **Subscription:** Sets status to `PAST_DUE` or `CANCELLED`.
4.  **Entitlement:** Sets Grant status to `REVOKED` or `EXPIRED`.
5.  **Governance:** Scans User's Active Listings -> Sets `systemStatus = INACTIVE_BILLING`.

### Flow D: Listing Publish (Unified)
1.  **User:** Clicks "Publish".
2.  **Check:** `EntitlementService` verifies `used < capacity`.
3.  **Action:** 
    *   `editorialStatus` -> `SUBMITTED`.
    *   `moderationStatus` -> `PENDING_REVIEW`.
    *   `systemStatus` -> `ACTIVE`.
4.  **Admin:** Approves listing.
5.  **Action:** `moderationStatus` -> `APPROVED`.
6.  **Result:** Listing is now Visible.

### Flow E: Refund (Admin)
1.  **Admin:** Initiates Refund.
2.  **Server:** Calls PayPal Refund API.
3.  **Ledger:** Writes `LedgerTransaction` (REFUND, negative amount).
4.  **Subscription:** Marked `REFUNDED`.
5.  **Entitlement:** Grants `REVOKED`.
6.  **Governance:** Listings -> `INACTIVE_BILLING`.

---

## 5. Webhook Ingestion Strategy

*   **Endpoint:** `/api/webhooks/paypal`
*   **Verification:** PayPal HMAC Signature.
*   **Idempotency:** `LedgerTransaction.providerTxId` is unique. 
*   **Handling:**
    *   Success (DB Write OK): Return 200.
    *   Transient Fail (DB Down): Return 500 (PayPal Retries).
    *   Logic Fail (User Not Found): Log Error, Return 200 (Stop Retries).

---

## 6. Migration Strategy

### Phase 1: Ledger Enforcement (Non-Breaking)
*   Deploy `LedgerTransaction` table.
*   Patch `activateSubscription` & `createProject` to write to Ledger.
*   **Result:** Stop data loss.

### Phase 2: Entitlement Split (Backfill)
*   Deploy `EntitlementDefinition` & `EntitlementGrant`.
*   Script: Iterate all Active Subscriptions -> Create corresponding Grants.
*   **Result:** Decoupling ready.

### Phase 3: Listing State Refactor (Breaking)
*   Deploy new Enum columns (`editorial`, `moderation`, `system`).
*   Script: Map `published=true` -> `SUBMITTED` + `APPROVED` + `ACTIVE`.
*   Refactor Queries: Replace `where: { published: true }` with tri-state check.

### Phase 4: Automation (Webhooks)
*   Deploy Webhook Handler.
*   Enable auto-revocation logic.
*   **Result:** System is self-driving.
