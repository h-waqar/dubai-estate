# Phase 2: Entitlement Split

## Goals
- Decouple "Payment" (Subscription) from "Access" (Entitlement).
- Enable flexible quotas (e.g., "5 Listings") independent of billing cycles.

## Architecture Constraints
- `EntitlementGrant` governs user capabilities.
- Subscriptions only trigger grants; they do not directly authorize actions.

## Workflow

### 1. Schema Definition
- [ ] **Task 2.1: Prisma Schema Update**
  - **File**: `prisma/schema.prisma`
  - **Steps**:
    1. Define `model EntitlementDefinition` (The "Product").
    2. Define `model EntitlementGrant` (The "User Asset").
    3. Define `enum GrantStatus { ACTIVE EXPIRED REVOKED }`.
  - **Validation**: Run `npx prisma validate` and migrate.

### 2. Service Implementation
- [ ] **Task 2.2: Entitlement Service**
  - **File**: `src/modules/entitlement/entitlement.service.ts`
  - **Methods**:
    - `grant(userId, code, quantity, sourceId)`: Creates a grant.
    - `revoke(grantId)`: Sets status to REVOKED.
    - `checkCapacity(userId, code)`: Returns boolean (Used < Capacity).
    - `consume(userId, code)`: Increments `used` count.

### 3. Integration (The Bridge)
- [ ] **Task 2.3: Connect Subscription to Entitlement**
  - **File**: `src/actions/subscription.ts` (or relevant handler).
  - **Logic**:
    - When Subscription `ACTIVE` -> `EntitlementService.grant(user, 'PROPERTY_SLOT', plan.limit)`.
    - When Subscription `CANCELLED` -> `EntitlementService.revoke(...)`.

### 4. Migration (Backfill)
- [ ] **Task 2.4: Seed Definitions**
  - **Script**: `prisma/seed.ts` or standalone.
  - **Action**: Insert standard definitions: `PROPERTY_SLOT`, `PROJECT_SLOT`, `FEATURED_BOOST`.

- [ ] **Task 2.5: Backfill Users**
  - **Script**: `scripts/migrate_entitlements.ts`
  - **Logic**:
    - Find all `Subscription` where `status = ACTIVE`.
    - For each, create an `EntitlementGrant` matching their plan limits.
  - **Verification**: Ensure no user loses access during the transition.
