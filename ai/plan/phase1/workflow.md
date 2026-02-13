# Phase 1: Ledger Enforcement

## Goals
- Make the Ledger the single source of truth for financial events.
- Stop "magical" state updates; everything must have a transaction record.

## Architecture Constraints
- **Immutability**: `LedgerTransaction` must be immutable (no UPDATE/DELETE).
- **Single Writer**: `LedgerService` is the ONLY allowed writer to this table.
- **Atomic Failure**: `activateSubscription` must fail if the Ledger write fails. No partial success.
- **Statelessness**: `LedgerService` is a "dumb, obedient accountant". It never reads business state, mutates subscriptions, or applies domain logic.

## Workflow

### 1. Schema Definition
- [ ] **Task 1.1: Prisma Schema Update**
  - **File**: `prisma/schema.prisma`
  - **Steps**:
    1. Define `enum TransactionType { PAYMENT REFUND DISPUTE CREDIT }`.
    2. Define `enum TransactionStatus { PENDING COMPLETED FAILED }`.
    3. Define `model LedgerTransaction`.
       - Fields: `id`, `userId`, `amount`, `currency`, `status`, `type`, `provider`, `providerTxId` (unique), `metadata`.
       - **Crucial Fields**: `occurredAt` (DateTime), `createdAt` (DateTime @default(now())).
       - Relations: `User`.
  - **Validation**: Run `npx prisma validate`.

- [ ] **Task 1.2: Migration**
  - **Steps**:
    1. `npx prisma migrate dev --name init_ledger`.
    2. Verify table creation in database.

### 2. Service Implementation
- [ ] **Task 1.3: Ledger Service Scaffold**
  - **File**: `src/modules/finance/ledger.service.ts`
  - **Steps**:
    1. Create class/module `LedgerService`.
    2. Implement `recordTransaction(data: CreateTransactionInput)`.
  - **Logic Rules**:
    - **Idempotency**: Check if `providerTxId` exists. If yes, return existing record.
    - **Stateless**: Never read business state (e.g., check if user is active).
    - **No Side Effects**: Never mutate Subscriptions or other domains from here.
    - **No Domain Logic**: Just record what the provider says happened.

### 3. Integration
- [ ] **Task 1.4: Patch Subscription Activation**
  - **File**: `src/actions/coupon.ts` / `src/actions/dashboard.ts` (Identify correct file for subscription logic).
  - **Steps**:
    1. Locate `activateSubscription` function.
    2. **Before** updating `Subscription` status:
       - Call `LedgerService.recordTransaction()`.
    3. **Failure Rule**: If Ledger write fails -> **throw immediately**. 
       - Do not proceed to update Subscription status.
       - Fail loudly (no soft errors, no silent retries at this level).
    4. Wrap in `prisma.$transaction` if possible to ensure atomicity.

### 4. Verification
- [ ] **Task 1.5: Manual Test**
  - **Steps**:
    1. Buy a subscription (or simulate one).
    2. Check Database: Is there a `LedgerTransaction` row?
    3. Check Subscription: Is it Active?
    4. **Simulate Failure**: Force a Ledger write error. Verify the Subscription status remains unchanged.
