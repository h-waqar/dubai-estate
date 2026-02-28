# Implementation Workflow: Project Advertise Subscription Refactor

## Project Overview

This workflow defines the process of refactoring the `/advertise/*` modules. Currently, the project submission includes a direct "Payment" wizard step (Step 9), and the URLs are inconsistent. 
To align with the new **Ledger-First Architecture** and **Entitlement System** (as defined in `01_workflow.md`), we must prevent users from accessing the wizards at all if they do not have an active subscription or sufficient quota.

Instead of taking the user to a checkout step at the end, we will show an "Access Restricted" screen at the very beginning if they lack quota.

Additionally, we will refactor the routing to be more explicit:
- `/advertise` -> `/advertise/property`
- `/advertise/project` -> `/advertise/projects`

---

## Architecture Constraints (Non-Negotiable)

- **Subscription-Driven Quotas**: Users must have available "Project Quota" from an active subscription to submit a project.
- **No In-Wizard Payment**: The wizard is exclusively for data entry. Payments happen on the `/pricing` page.
- **Pre-Flight Checks**: The `/advertise/project` page must physically block access and redirect to `/pricing` if the quota is exceeded, matching the `Property` flow.

---

## Refactoring Steps

### 1. Route Refactoring
- **Domain**: `Next.js App Router`
- **Description**: Rename folders to clarify intent.
- **Action**: 
  - Move `src/app/(frontend)/advertise/page.tsx` => `src/app/(frontend)/advertise/property/page.tsx`
  - Move `src/app/(frontend)/advertise/project/page.tsx` => `src/app/(frontend)/advertise/projects/page.tsx`
  - Search and replace all hardcoded links to these routes across the app (e.g., in Navigation, Homepage CTA, Success pages).

### 2. Quota Enforcement (Pre-Flight Block)
- **Domain**: `Page / Server Components`
- **Description**: Introduce `checkProjectQuota()` at the top-level `/advertise/project/page.tsx`.
- **Action**: If `!quota.allowed`, render the exact same "Access Restricted" block used in properties:
  > "No active entitlements found. Buy a plan to start listing."
  > [View Plans] [Manage My Projects]
- **Goal**: Hard redirect/block users without quota *before* they even start filling out the form.

### 2. Wizard Restructuring
- **Domain**: `Frontend Components`
- **Description**: Remove `StepNinePayment` and `StepNineSuccess` from `ProjectAdvertiseWizard.tsx`.
- **Action**: The flow will now end at `StepEightReview` (or become `StepNineReview` depending on numbering).

### 3. Store Cleansing
- **Domain**: `Zustand Stores`
- **Description**: Clean up `useProjectAdvertiseStore.ts`.
- **Action**: Remove payment-related state fields (`paymentMethod`, `cardNumber`, `cvv`, `billingAddress`, etc.).

### 4. Server Action Update
- **Domain**: `Server Actions`
- **Description**: Update `createProject.action.ts` to hook into the Governance and Entitlement domains if necessary.
- **Action**: The action should no longer expect payment details. Instead, upon successful creation, it should trigger the `EntitlementService` to consume 1 Project token (if implemented) and set the Governance flags to `PENDING_REVIEW` / `SUBMITTED`.

---

## Goal State
A streamlined Project Wizard that mirrors the Property Wizard:
- Step 1: Basic Info
- Step 2: Description & Location
- Step 3: Features & Amenities
- Step 4: Pricing & Payment Plans
- Step 5: Media & Gallery
- Step 6: Floorplans
- Step 7: Review & Submit (Final Step)
