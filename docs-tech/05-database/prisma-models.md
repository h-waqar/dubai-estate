# Prisma Models

## Core Domain

### User & Auth
- `User`: Central entity. Contains auth data, roles, and relations to content.
- `Account`, `Session`: NextAuth tables.

### Property Listing
- `Property`: The main listing unit.
    - `status`: DRAFT, PENDING_REVIEW, APPROVED, DECLINED.
    - `listingType`: SALE, RENT.
- `PropertyType`: Metadata (Apartment, Villa).
- `PropertyImage`, `PropertyVideo`: Media assets.
- `PropertyFeature`: Many-to-Many relation with `Feature`.

### Projects (Off-Plan)
- `Project`: Development projects.
    - `projectType`: FUTURE, CURRENT, PAST.
    - `developer`: Link to `Developer` model.
- `ProjectFloorplan`, `ProjectAmenity`: Details.
- `ProjectProgress`: Timeline updates.

### Content
- `Post`: Blog articles.
- `Category`: Blog categories.
- `Media`: Centralized file storage (Cloudinary references).

### Commerce
- `PricingPlan`: Subscription tiers.
- `Subscription`: User subscriptions.
- `Payment`: Transaction logs.
