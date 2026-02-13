# Implementation Workflow: Ledger-Centric Marketplace

## Project Overview

This workflow defines the transition of Dubai Estate from a reactive subscription model to a **Ledger-First** architecture. The goal is to ensure financial integrity, decoupled access management (Entitlements), and deterministic listing visibility (Tri-State Governance).

---

## Architecture Constraints (Non-Negotiable)

- **Ledger-First**: No state change in Subscriptions or Entitlements without a `LedgerTransaction`.
- **Server Verification**: All payment events must be verified against PayPal API or Webhook signatures.
- **Entitlement Decoupling**: Access logic (can I list?) must query the Entitlement Domain, not the Subscription Domain.
- **Tri-State Governance**: Listing visibility is a product of Editorial (User), Moderation (Admin), and System (Billing/Quota) states.

---

## Inventory

| Component           | Status       | Description                                                    |
| :------------------ | :----------- | :------------------------------------------------------------- |
| `LedgerTransaction` | **BUILD**    | New source of truth for financial events.                      |
| `EntitlementSystem` | **BUILD**    | Definitions and Grants for user capabilities.                  |
| `Subscription`      | **REFACTOR** | Transition to react to Ledger events and trigger Entitlements. |
| `Payment`           | **REFACTOR** | Legacy model; will be deprecated in favor of Ledger.           |
| `Property`          | **REFACTOR** | Implement Tri-State status columns.                            |
| `Project`           | **REFACTOR** | Implement Tri-State status columns.                            |
| `Webhook Handler`   | **BUILD**    | Secure ingestion for PayPal events.                            |

---

## Phase 0: Baseline & Safety Net
*Focus: Ensure refactors don’t silently corrupt data.*

- [ ] Task 0.1: Snapshot Current Subscription & Listing States
  - Domain: Infra
  - Description: Export counts of active subscriptions, listings, and payments.
  - Status: TODO
  - Notes: Used to verify post-migration correctness.

- [ ] Task 0.2: Add Feature Flags (Optional)
  - Domain: Infra
  - Description: Guard Ledger-first paths behind flags where possible.
  - Status: TODO


## Phase 1: Ledger Enforcement (Infra & Ledger)

_Focus: Establish the immutable financial record._

- [ ] **Task 1.1: Schema Update - Ledger Core**
  - **Domain**: Infra
  - **Description**: Add `LedgerTransaction` model and enums (`TransactionType`, `TransactionStatus`).
  - **Status**: TODO
  - **Notes**: Must include `providerTxId` unique constraint for idempotency.

- [ ] **Task 1.2: Ledger Service Implementation**
  - **Domain**: Ledger
  - **Description**: Create `LedgerService` to handle creation of transaction records.
  - **Status**: TODO
  - **Notes**: Should only be callable by verified server actions or webhook handlers. LedgerService must never UPDATE or DELETE transactions.
    Corrections happen via compensating transactions only.

- [ ] **Task 1.3: Patch Subscription Actions**
  - **Domain**: Subscription
  - **Description**: Update `activateSubscription` to write a `LedgerTransaction` before updating subscription status.
  - **Status**: TODO
  - **Notes**: First point of enforcement.

---

## Phase 2: Entitlement Split (Entitlement)

_Focus: Decouple "Payment" from "Access"._

- [ ] **Task 2.1: Schema Update - Entitlement Core**
  - **Domain**: Infra
  - **Description**: Add `EntitlementDefinition` and `EntitlementGrant` models.
  - **Status**: TODO
  - **Notes**: Definitions should include codes like `PROPERTY_SLOT`.

- [ ] **Task 2.2: Entitlement Service Implementation**
  - **Domain**: Entitlement
  - **Description**: Logic for `grant()`, `revoke()`, and `checkCapacity()`.
  - **Status**: TODO
  - **Notes**: Centralizes quota enforcement.

- [ ] **Task 2.3: Subscription-to-Entitlement Bridge**
  - **Domain**: Subscription
  - **Description**: Trigger Entitlement grants when a Subscription becomes active.
  - **Status**: TODO
  - **Notes**: Ensures users get what they paid for.

- [ ] **Task 2.4: Backfill Migration Script**
  - **Domain**: Infra
  - **Description**: Script to create Entitlement Grants for all existing active subscriptions.
  - **Status**: TODO

---

## Phase 3: Listing State Refactor (Governance)

_Focus: Deterministic visibility logic._

- [ ] **Task 3.1: Schema Update - Tri-State Columns**
  - **Domain**: Infra
  - **Description**: Add `editorialStatus`, `moderationStatus`, and `systemStatus` to `Property` and `Project`.
  - **Status**: TODO
  - **Notes**: Set sensible defaults that map to current `status` and `published` fields.

- [ ] **Task 3.2: Governance Service Implementation**
  - **Domain**: Governance
  - **Description**: Centralize visibility checks. `Visible = SUBMITTED & APPROVED & ACTIVE`.
  - **Status**: TODO
  - **Notes**: Replace all direct `published: true` queries with a service call or standard Prisma filter.

- [ ] **Task 3.3: UI/UX State Mapping**
  - **Domain**: Infra
  - **Description**: Update Admin and User dashboards to reflect the Tri-State reality.
  - **Status**: TODO

---

## Phase 4: Automation & Security (Infra & Ledger)

_Focus: Self-driving system and protection._

- [ ] **Task 4.1: PayPal Webhook Ingestion**
  - **Domain**: Ledger
  - **Description**: Implement `/api/webhooks/paypal` with signature verification.
  - **Status**: TODO
  - **Notes**: Must handle `PAYMENT.SALE.COMPLETED`, `DENIED`, and `CANCELLED`.

- [ ] **Task 4.2: Automated Revocation Logic**
  - **Domain**: Governance
  - **Description**: Logic to set `systemStatus = INACTIVE_BILLING` when a subscription fails or expires.
  - **Status**: TODO

- [ ] **Task 4.3: Final Security Audit**
  - **Domain**: Infra
  - **Description**: Ensure no client-side state can bypass Ledger or Entitlement checks.
  - **Status**: TODO
