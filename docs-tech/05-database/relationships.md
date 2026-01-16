# Database Relationships

## Key Relations

### User <-> Content
- **1:N**: User -> Properties (`createdById`).
- **1:N**: User -> Projects (`createdById`).
- **1:N**: User -> Posts (`authorId`).

### User <-> Subscription
- **1:N**: User -> Subscriptions (History of subscriptions).
- **1:1**: User -> PricingPlan (Current plan linkage via `pricingPlanId` - *Note: Schema shows `pricingPlanId` on User, which acts as a cache/current pointer*).

### Property <-> Features
- **M:N**: `Property` <-> `Feature` (via explicit join table `PropertyFeature`).

### Media Polymorphism
- The `Media` model uses a `MediaUsage` join table to support polymorphic relations.
- A single `Media` file can be attached to multiple entities (Property, Project, User) via `MediaUsage` (`entityId`, `entityType`).
