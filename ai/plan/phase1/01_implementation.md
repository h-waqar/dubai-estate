# Implementation Plan: Phase 1 - Ledger Enforcement

## Overview
This plan details the technical execution of Phase 1. We will establish the `LedgerTransaction` as the primary source of truth for financial events and integrate it into the `activateSubscription` workflow with strict atomicity and error handling.

---

## 1. Schema Update (Prisma)
**Goal**: Add the Ledger models and enums to the database.

- **Action**: Modify `prisma/schema.prisma`.
- **Changes**:
  - Add `enum TransactionType { PAYMENT, REFUND, DISPUTE, CREDIT }`.
  - Add `enum TransactionStatus { PENDING, COMPLETED, FAILED }`.
  - Add `model LedgerTransaction`:
    ```prisma
    model LedgerTransaction {
      id              String            @id @default(uuid())
      userId          Int
      type            TransactionType
      status          TransactionStatus
      amount          Decimal           @db.Decimal(10, 2)
      currency        String            @default("USD")
      provider        String            // e.g., "PAYPAL"
      providerTxId    String            @unique
      metadata        Json?
      occurredAt      DateTime          // Time reported by provider
      createdAt       DateTime          @default(now())
      user            User              @relation(fields: [userId], references: [id])
    }
    ```
  - Add `ledgerTransactions LedgerTransaction[]` to the `User` model.
- **Commands**:
  - `npx prisma validate`
  - `npx prisma migrate dev --name add_ledger_transactions`

---

## 2. Service Implementation (LedgerService)
**Goal**: Create a stateless service to record transactions.

- **File**: `src/modules/finance/ledger.service.ts`
- **Logic**:
  - **Function**: `recordTransaction(params: RecordTransactionParams)`
  - **Idempotency**: Use `upsert` or a `findUnique` check on `providerTxId` to prevent duplicate records.
  - **Statelessness**: Do not include any business logic or side effects (like updating user roles).
- **Draft Interface**:
  ```typescript
  interface RecordTransactionParams {
    userId: number;
    type: TransactionType;
    status: TransactionStatus;
    amount: Prisma.Decimal;
    currency: string;
    provider: string;
    providerTxId: string;
    occurredAt: Date;
    metadata?: any;
  }
  ```

---

## 3. Integration: Secure Subscription Activation
**Goal**: Patch `activateSubscription` to enforce ledger-first logic.

- **File**: `src/modules/user/actions/activateSubscription.ts`
- **Modifications**:
  1. Import `LedgerService`.
  2. Use `prisma.$transaction` to wrap the entire activation logic.
  3. **New Step (Pre-Update)**: Call `LedgerService.recordTransaction()` using data from `subDetails`.
     - `amount`: Extract from `subDetails.billing_info.last_payment.amount.value`.
     - `occurredAt`: Use `subDetails.billing_info.last_payment.time`.
     - `providerTxId`: Use `subDetails.id` or the specific payment ID if available.
  4. **Strict Error Handling**: Ensure that if `recordTransaction` fails, the transaction is rolled back and an error is thrown to the caller.

---

## 4. Verification & Testing
**Goal**: Ensure correctness and failure safety.

- **Manual Test (Happy Path)**:
  - Simulate a subscription activation.
  - Verify `LedgerTransaction` is created.
  - Verify `Subscription` and `User` are updated.
- **Failure Test (Atomicity)**:
  - Temporarily mock `LedgerService` to throw an error.
  - Attempt activation.
  - Verify **no changes** are made to `Subscription` or `User` tables (rollback check).
- **Idempotency Test**:
  - Call `activateSubscription` twice with the same ID.
  - Verify only one `LedgerTransaction` exists.

---

## 5. Safety & Security Checklist
- [ ] No `UPDATE` or `DELETE` operations allowed on `LedgerTransaction`.
- [ ] `providerTxId` must have a unique constraint.
- [ ] All database writes must be inside a transaction.
- [ ] Validated with `npm run build` to ensure type safety.
