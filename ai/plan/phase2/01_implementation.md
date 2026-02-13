# Implementation Plan: Phase 2 - Entitlement Split

## Overview
This phase decouples billing (Subscription) from access (Entitlements). We will introduce the Entitlement Domain, implement the logic for granting and consuming usage quotas, and migrate existing subscribers to this new model without service interruption.

---

## 1. Schema Update (Prisma)
**Goal**: Define what users "own" vs. what they "paid for".

- **Action**: Modify `prisma/schema.prisma`.
- **Changes**:
  - Add `enum GrantStatus { ACTIVE, EXPIRED, REVOKED }`.
  - Add `model EntitlementDefinition`:
    ```prisma
    model EntitlementDefinition {
      id          String   @id @default(cuid())
      code        String   @unique // e.g., 'PROPERTY_SLOT'
      description String?
      grants      EntitlementGrant[]
    }
    ```
  - Add `model EntitlementGrant`:
    ```prisma
    model EntitlementGrant {
      id           String      @id @default(cuid())
      userId       Int
      definitionId String
      amount       Int         // Capacity (e.g., 5 slots)
      used         Int         @default(0)
      sourceType   String      // "SUBSCRIPTION", "BONUS"
      sourceId     String      // Subscription.id
      validFrom    DateTime    @default(now())
      validTo      DateTime?
      status       GrantStatus @default(ACTIVE)
      
      user         User                  @relation(fields: [userId], references: [id])
      definition   EntitlementDefinition @relation(fields: [definitionId], references: [id])

      @@index([userId, status])
    }
    ```
- **Commands**:
  - `npx prisma validate`
  - `npx prisma migrate dev --name add_entitlements`

---

## 2. Service Implementation (EntitlementService)
**Goal**: centralized logic for capacity checks and quota management.

- **File**: `src/modules/entitlement/entitlement.service.ts`
- **Class**: `EntitlementService`
- **Methods**:
  1.  `grant(userId: number, code: string, amount: number, sourceId: string)`:
      - Finds `EntitlementDefinition` by code.
      - Creates an `EntitlementGrant`.
  2.  `revoke(sourceId: string)`:
      - Finds all grants linked to this `sourceId` (e.g., Subscription ID).
      - Sets status to `REVOKED`.
  3.  `checkCapacity(userId: number, code: string)`:
      - Aggregates all `ACTIVE` grants for the user and code.
      - Returns `total_capacity > total_used`.
  4.  `consume(userId: number, code: string)`:
      - Finds an active grant with available capacity.
      - Increments `used`.
      - Throws error if no capacity.
  5.  `release(userId: number, code: string)`:
      - Decrements `used` (for when a property is archived/deleted).

---

## 3. Integration: Subscription Bridge
**Goal**: Automate entitlement lifecycle based on subscription events.

- **File**: `src/modules/user/actions/activateSubscription.ts` (and cancellation logic).
- **Modifications**:
  - **On Activation**:
    - After successful Ledger write and Subscription update.
    - Look up `PricingPlan` limits (e.g., `maxListings`).
    - Call `EntitlementService.grant(userId, 'PROPERTY_SLOT', plan.maxListings, subscription.id)`.
  - **On Cancellation/Expiration**:
    - Call `EntitlementService.revoke(subscription.id)`.

---

## 4. Migration & Backfill
**Goal**: Ensure existing users are recognized by the new system.

- **Step 1: Seed Definitions**:
  - Create `prisma/seed_entitlements.ts`.
  - Insert: `PROPERTY_SLOT`, `PROJECT_SLOT`, `FEATURED_BOOST`.
- **Step 2: Backfill Script**:
  - Create `scripts/migrate_entitlements.ts`.
  - Logic:
    1. Fetch all `Subscription` where `status` is `ACTIVE`.
    2. For each, fetch the associated `PricingPlan`.
    3. Create an `EntitlementGrant` for the user with `amount = plan.maxListings`.
  - **Run**: `npx tsx scripts/migrate_entitlements.ts`.

---

## 5. Verification
- **Test Case 1**: User buys subscription -> Grant created?
- **Test Case 2**: User cancels subscription -> Grant revoked?
- **Test Case 3**: `checkCapacity` returns true for active user, false for new user?
- **Test Case 4**: Backfill script correctly processes a test database dump?
