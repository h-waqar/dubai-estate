# Subscription System

## Overview
The subscription system gates the ability to list properties. Users must subscribe to a `PricingPlan` to get a quota of listings.

## Data Models
- **PricingPlan**: Defines the tier (Silver, Gold, etc.), price, and listing limits (`maxListings`).
- **Subscription**: Links a `User` to a `PricingPlan`. Stores `paypalSubscriptionId`.

## Workflow
1.  **Plan Selection**: User visits `/pricing`, selects a plan.
2.  **PayPal Flow**:
    - Frontend initiates PayPal Subscription flow using `paypal-js`.
    - On approval, PayPal returns a `subscriptionID`.
3.  **Activation**:
    - Backend validates the subscription via PayPal API.
    - Creates `Subscription` record in DB.
    - Updates User's `pricingPlanId`.

## Quota Enforcement
- **Action**: `checkQuota` (src/modules/property/actions/checkQuota.ts).
- **Logic**:
    1. Check user's active subscription.
    2. Count user's current properties.
    3. If `count >= plan.maxListings`, reject creation.

## Admin Management
- **Create Plan**: `PricingService.createPlan`.
    - Automatically creates a Product and Plan in PayPal API if credentials exist.
- **Delete Plan**: `PricingService.deletePlan`.
    - Deactivates plan in PayPal.
    - Soft-delete or blocked if users are subscribed.
