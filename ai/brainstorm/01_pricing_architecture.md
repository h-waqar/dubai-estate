# Entitlement-Driven Pricing Architecture (Brainstorm 01)

## The Core Concept
Your idea is brilliant and highly scalable. Instead of adding columns like `maxProjectListings`, `maxSupportTickets`, or `maxVideos` to the `PricingPlan` table every time we invent a new feature, we can make the `PricingPlan` table entirely generic.

A **Pricing Plan** will simply become a "Bundle of Entitlements". 

### Proposed Schema Change

Currently, `PricingPlan` looks like this:
```prisma
model PricingPlan {
  id                  Int
  name                String
  maxListings         Int            @default(3)
  maxFeaturedListings Int            @default(0)
  // ...
}
```

We will remove hardcoded limits and introduce a junction table:
```prisma
model PricingPlan {
  id                  Int            @id @default(autoincrement())
  name                String         @unique
  // ... price, stripe/paypal IDs
  entitlements        PlanEntitlement[]  // <--- The key link
}

model PlanEntitlement {
  id           Int                   @id @default(autoincrement())
  planId       Int
  definitionId String                // References EntitlementDefinition.id
  amount       Int                   // How many of this entitlement the plan gives (e.g., 5)

  plan         PricingPlan           @relation(fields: [planId], references: [id], onDelete: Cascade)
  definition   EntitlementDefinition @relation(fields: [definitionId], references: [id], onDelete: Cascade)

  @@unique([planId, definitionId])
}
```

## How It Changes The Architecture

1. **Admin Panel (`/admin/pricing/new`)**
   Instead of the form having inputs specifically for "Max Listings", the form will query all `EntitlementDefinition`s from the database (e.g., `PROPERTY_SLOT`, `PROJECT_SLOT`, `FEATURED_BOOST`). The admin can then dynamically add fields to the plan:
   - Gold Plan grants `PROPERTY_SLOT` x 10
   - Gold Plan grants `PROJECT_SLOT` x 2

2. **Subscription Activation (`activateSubscription.ts`)**
   Instead of hardcoding `EntitlementService.grant(userId, "PROPERTY_SLOT", dbPlan.maxListings)`, we loop through the plan's attached entitlements:
   ```typescript
   for (const planEntitlement of dbPlan.entitlements) {
        await EntitlementService.grant(
             session.user.id, 
             planEntitlement.definition.code, 
             planEntitlement.amount, 
             subscription.id,
             "SUBSCRIPTION",
             tx
        );
   }
   ```

3. **Quota Enforcement (`checkQuota.ts`, `createProject.action.ts`)**
   This remains exactly the same! The components just check `EntitlementService.checkCapacity(userId, 'PROJECT_SLOT')` and `EntitlementService.consume()`. They don't care how the user got the slot—whether from a plan, a one-off purchase, or a manual admin grant.

---

## Why Can Users Still Publish Right Now?

You mentioned: *"I was just testing and i can publish the projects even though we don't have anything to back that up. Also right now all the subscriptions the user have subscribed are cancelled still he can publish property and projects"*

I've investigated the code, and here is exactly why this is happening:

1. **Projects are completely ungated:** Let alone cancelled subscriptions, right now, *anyone* logged in can create a Project. The `createProject.action.ts` file currently has **zero** calls to `EntitlementService.consume()`. It never checks if the user has a `PROJECT_SLOT`.
2. **Properties and the Admin Bypass:** In `checkQuota.ts` for properties, the very first check is:
   ```typescript
   // Admins bypass quota
   if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) {
     return { allowed: true, isAdmin: true };
   }
   ```
   If the account you are testing with happens to be an ADMIN, the system completely ignores the fact that your subscription is cancelled. For a normal `USER`, the system correctly revokes the grants on cancellation (`status: 'REVOKED'`), and their capacity drops to 0.

## Next Steps

If you approve this architecture, we will execute the following:
1. Revamp the Schema: Remove `maxListings` and add `PlanEntitlement`.
2. Revamp the UI: Update the `PlanForm.tsx` to dynamically assign entitlements.
3. Update Activation logic to loop and grant dynamically.
4. Enforce Quota in `createProject.action.ts` so projects are no longer ungated!
