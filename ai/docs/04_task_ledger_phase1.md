# Task 04: Ledger Enforcement Phase 1

## What Was Done
- Added `LedgerTransaction` schema and enums (`TransactionType`, `TransactionStatus`).
- Implemented write-only `LedgerService` at `src/modules/finance/ledger.service.ts`.
- Enforced ledger-first activation in `src/modules/user/actions/activateSubscription.ts`.
- Ensured strict atomicity using `prisma.$transaction`.
- Fixed missing persistence of payments (payments are now recorded in `LedgerTransaction` before subscription updates).

## Files Modified/Created
- `prisma/schema.prisma`
- `src/modules/finance/ledger.service.ts`
- `src/modules/user/actions/activateSubscription.ts`

## Functions Written
- `ledgerService.recordTransaction()`
- `activateSubscription()` (modified to use transaction)

## Key Decisions
- **Ledger as source of truth**: Subscription state changes only happen if the ledger write succeeds.
- **Append-only financial records**: `LedgerTransaction` is designed to be immutable (no update/delete logic in service).
- **Transaction-level atomicity**: Used `prisma.$transaction` to ensure all or nothing execution.
- **Idempotency**: Used `upsert` on `providerTxId` to handle potential duplicate webhook/callback events (though currently mostly for activation).

## Testing Considerations
- **Idempotency**: Checked by design (upsert on unique `providerTxId`).
- **Atomic rollback**: `prisma.$transaction` guarantees rollback if any step fails.
- **Concurrent activation**: `upsert` handles race conditions on the ledger entry.
