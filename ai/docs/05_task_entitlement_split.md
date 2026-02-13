# Task 05: Entitlement Split (Phase 2)

## What Was Done
- Introduced **Entitlement Domain** to decouple billing from usage quotas.
- Added `EntitlementDefinition` and `EntitlementGrant` models to Prisma schema.
- Implemented `EntitlementService` for managing grants, capacity checks, and consumption/release logic.
- Integrated entitlement granting into the `activateSubscription` transaction.
- Integrated entitlement revocation into subscription cancellation and sync actions.
- Refactored property quota checking (`checkQuota`) to be entitlement-aware.
- Enforced entitlement consumption during property creation and release during archiving or declining.

## Files Modified/Created
- `prisma/schema.prisma`: Added entitlement models and enums.
- `src/modules/entitlement/entitlement.service.ts`: Core logic for entitlement management.
- `src/modules/user/actions/activateSubscription.ts`: Added grant logic to activation flow.
- `src/modules/user/actions/subscription.ts`: Added revoke logic to user cancellation.
- `src/modules/admin/actions/subscription.ts`: Added revoke logic to admin cancellation and sync.
- `src/modules/property/actions/checkQuota.ts`: Refactored to use `EntitlementService`.
- `src/modules/property/actions/createProperty.ts`: Wrapped in transaction with entitlement consumption.
- `src/modules/property/services/createProperty.ts`: Added `consume` call and transaction support.
- `src/modules/property/actions/deleteProperty.ts`: Implemented archiving with entitlement release.
- `src/modules/property/actions/approveProperty.ts`: Added entitlement release on decline.
- `prisma/seed_entitlements.ts`: Seed script for definitions.
- `scripts/migrate_entitlements.ts`: Backfill script for existing subscribers.

## Functions/Components Written
- `EntitlementService.grant()`: Creates a new grant.
- `EntitlementService.revoke()`: Marks grants as revoked.
- `EntitlementService.checkCapacity()`: Validates if user has available slots.
- `EntitlementService.getQuotaStatus()`: Returns detailed usage stats.
- `EntitlementService.consume()`: Increments usage on an active grant.
- `EntitlementService.release()`: Decrements usage (e.g., on deletion).
- `deletePropertyAction()`: New action for soft-deleting properties.

## Key Decisions
- **Decoupling**: The system now checks "Entitlements" instead of counting the `Property` table, allowing for flexible bonuses, one-time top-ups, and varying limits without schema changes.
- **Transaction-Safe Consumption**: Entitlement usage is incremented/decremented within the same database transaction as the entity creation/deletion to ensure data consistency.
- **Admin Bypass**: Preserved the logic where admins and super admins are not restricted by quotas.
- **Oldest-First Consumption**: `consume` logic uses the oldest available grants first.
- **Newest-First Release**: `release` logic releases from the newest grants first.

## Testing Considerations
- **Atomicity**: Verified that if property creation fails, the entitlement slot is not consumed (via transaction).
- **Backfill Accuracy**: The migration script correctly calculates `used` slots based on current property counts.
- **Revocation**: Verified that cancelling a subscription immediately hides the "capacity" from the user.
