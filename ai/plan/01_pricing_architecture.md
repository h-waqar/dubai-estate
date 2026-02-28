# Entitlement-Driven Pricing Architecture

Refactoring the pricing system to use a generic Bundle of Entitlements instead of hardcoded columns in the database.

## User Review Required

> [!WARNING]
> This requires a database migration that will **DROP** `maxListings` and `maxFeaturedListings` columns from `PricingPlan` table. Since this is an architectural shift, please ensure any existing plans on Production can be manually re-configured or seeded with the new entitlements after this migration. If you have live data that needs preserving, please let me know so we can write a custom data migration script instead.

> [!NOTE]
> We will update the default database seeder to populate the initial `EntitlementDefinition`s. The seeded values will be:
> - `PROPERTY_SLOT`
> - `PROJECT_SLOT`
> - `PROPERTY_FEATURE_SLOT`
> - `PROJECT_FEATURE_SLOT`

## Proposed Changes

### Database Schema

#### [MODIFY] prisma/schema.prisma
- Remove `maxListings` and `maxFeaturedListings` from the `PricingPlan` model.
- Add `PlanEntitlement` model with `planId`, `definitionId`, `amount`, and relations.
- Add `entitlements PlanEntitlement[]` to `PricingPlan`.
- *(Will run `npx prisma migrate dev` to apply changes).*

### Seeding

#### [MODIFY] prisma/seed.ts (or equivalent)
- Add logic to upsert `EntitlementDefinition`s for: `PROPERTY_SLOT`, `PROJECT_SLOT`, `PROPERTY_FEATURE_SLOT`, `PROJECT_FEATURE_SLOT`.

---

### Backend Logic & Action

#### [MODIFY] src/modules/pricing/validators/createPricing.validator.ts
- Remove `maxListings` and `maxFeaturedListings`.
- Add `entitlements: z.array(z.object({ definitionId: z.string(), amount: z.number() }))`.

#### [MODIFY] src/modules/pricing/actions/managePlan.ts
- Update `createPlanAction` and `updatePlanAction` to write `entitlements` loop to the database (creating `PlanEntitlement` records).

#### [MODIFY] src/modules/user/actions/activateSubscription.ts
- Fetch `PricingPlan` with `include: { entitlements: { include: { definition: true } } }`.
- Replace hardcoded `PROPERTY_SLOT` grant with a dynamic loop over `dbPlan.entitlements`.

#### [MODIFY] src/modules/project/actions/createProject.action.ts
- Implement quota check (`EntitlementService.getQuotaStatus(user.id, "PROJECT_SLOT")`) before initializing project creation.
- Check admin roles to bypass quota if necessary.

#### [MODIFY] src/modules/project/services/project.service.ts
- Call `EntitlementService.consume(userId, "PROJECT_SLOT", tx)` within the project creation transaction.

---

### UI Components

#### [MODIFY] src/modules/pricing/components/PlanForm.tsx
- Remove inputs for `Max Listings Limit`.
- Fetch `EntitlementDefinition` list on mount.
- Render dynamic inputs for every `EntitlementDefinition` allowing the admin to set the `amount` for each code (e.g. Properties, Projects, Featured Boost).

## Verification Plan

### Automated/Compilation Tests
- Run `tsc --noEmit` to verify TypeScript typing is safe and hasn't broken.
- Verify `npx prisma validate` passes successfully.

### Manual Verification
- We will start `npm run dev` and navigate to `/admin/pricing/new`.
- Verify the form shows the dynamic entitlement inputs instead of just `maxListings`.
- Save a plan and verify rows are added to `PlanEntitlement` in Prisma Studio.
- Fake a subscription activation or create a test subscription to verify entitlements are granted correctly.
- Ensure that creating a project rejects standard users without an active `PROJECT_SLOT`.
