# Phase 4: Automation & Security

## Goals
- Automate the response to external financial events.
- Secure the system against bypassing the Ledger.

## Workflow

### 1. Webhook Implementation
- [ ] **Task 4.1: PayPal Webhook Handler**
  - **File**: `src/app/api/webhooks/paypal/route.ts`
  - **Steps**:
    1. Verify Signature (HMAC).
    2. Extract Event Type (`PAYMENT.SALE.COMPLETED`, etc.).
    3. Call `LedgerService.recordTransaction()`.
    4. Call `SubscriptionService` to update status.
    5. Call `EntitlementService` to grant/revoke.

### 2. Automation Logic
- [ ] **Task 4.2: Auto-Revocation**
  - **Logic**:
    - When `Subscription` -> `PAST_DUE` or `CANCELLED`:
      1. Find all `EntitlementGrant` from this subscription.
      2. Set Grant status -> `REVOKED`.
      3. **Governance**: Find all User's Properties.
      4. Set `Property.systemStatus` -> `INACTIVE_BILLING`.

### 3. Final Verification
- [ ] **Task 4.3: Security Audit**
  - **Checklist**:
    - Can a user POST to `/api/ledger`? (Should be NO).
    - Does `activateSubscription` fail if PayPal says "PENDING"? (Should be YES).
    - Can a user see a "Hidden" property by guessing the URL? (Should be NO).

- [ ] **Task 4.4: Cleanup**
  - **Action**: Remove the legacy `published` column (optional, or mark deprecated).
  - **Action**: Remove unused `Payment` model code if fully replaced.
