# Implementation Plan: Phase 4 - Automation & Security

## Overview
This final phase automates the system's reaction to external financial events (PayPal webhooks) and secures the application against state manipulation. It closes the loop between the Ledger, Subscription, Entitlement, and Governance domains.

---

## 1. Webhook Implementation
**Goal**: Securely ingest PayPal events to update system state.

- **File**: `src/app/api/webhooks/paypal/route.ts`
- **Security**:
  - Implement HMAC signature verification using PayPal SDK or raw headers.
  - Reject any request with invalid signature (Return 400/403).
- **Handler Logic**:
  1. **Receive Payload**: Parse JSON.
  2. **Verify**: Check signature.
  3. **Switch Event Type**:
     - `PAYMENT.SALE.COMPLETED`:
       - Call `LedgerService.recordTransaction()` (Type: PAYMENT).
       - Call `SubscriptionService.renew()`.
     - `BILLING.SUBSCRIPTION.CANCELLED`:
       - Call `LedgerService.recordTransaction()` (Type: INFO/STATUS_CHANGE).
       - Call `SubscriptionService.cancel()`.
     - `PAYMENT.SALE.DENIED`:
       - Call `LedgerService.recordTransaction()` (Type: FAILED).
       - Call `SubscriptionService.markPastDue()`.
- **Idempotency**: `LedgerService` will handle duplicate webhook deliveries via `providerTxId`.

---

## 2. Automation Logic (Auto-Revocation)
**Goal**: Automatically enforce billing status on listings.

- **Trigger**: When Subscription transitions to `CANCELLED`, `EXPIRED`, or `PAST_DUE`.
- **Action Flow**:
  1. **Revoke Entitlements**:
     - `EntitlementService.revoke(subscriptionId)`.
  2. **Governance Enforcement**:
     - Find all properties owned by `userId`.
     - Update `systemStatus` to `INACTIVE_BILLING`.
- **Service Integration**:
  - Add this logic to `SubscriptionService.updateStatus()`.

---

## 3. Final Security Audit & Cleanup
**Goal**: Hardening the application before full release.

- **Audit Checklist**:
  - [ ] **Ledger Integrity**: Verify no API route allows direct writes to `LedgerTransaction` (except Webhook/Server Actions).
  - [ ] **Bypass Check**: Verify that setting `published=true` (legacy) does NOT make a property visible anymore (Tri-state check must be active).
  - [ ] **Payment Verification**: Ensure `activateSubscription` strictly requires a successful Ledger write.
- **Cleanup**:
  - Mark `published` column as `@deprecated` in Schema or remove it.
  - Delete legacy `Payment` model if it's no longer used.
  - Remove any "Draft" or temporary migration scripts.

---

## 4. Verification
- **Test Case 1 (Webhook)**: Simulate a `PAYMENT.SALE.COMPLETED` webhook.
  - Does it create a Ledger entry?
  - Does it extend the subscription?
- **Test Case 2 (Revocation)**: Simulate a `CANCELLED` webhook.
  - Are entitlements revoked?
  - Are user's properties hidden (`systemStatus` check)?
- **Test Case 3 (Security)**: Attempt to hit the webhook endpoint without a valid signature. Should return 4xx.
