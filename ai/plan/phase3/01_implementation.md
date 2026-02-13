# Implementation Plan: Phase 3 - Listing State Refactor

## Overview
This phase introduces "Tri-State Governance" to eliminate ambiguity in listing visibility. A property will only be visible if it satisfies three independent conditions: User Intent (Editorial), Admin Approval (Moderation), and System Compliance (Billing/Quota).

---

## 1. Schema Update (Prisma)
**Goal**: Replace the single `published` boolean with granular state columns.

- **Action**: Modify `prisma/schema.prisma`.
- **Changes**:
  - Add Enums:
    ```prisma
    enum EditorialStatus { DRAFT, SUBMITTED, ARCHIVED }
    enum ModerationStatus { PENDING_REVIEW, APPROVED, REJECTED, SUSPENDED }
    enum SystemStatus { ACTIVE, INACTIVE_BILLING, INACTIVE_QUOTA }
    ```
  - Update `Property` and `Project` models:
    - Add `editorialStatus EditorialStatus @default(DRAFT)`
    - Add `moderationStatus ModerationStatus @default(PENDING_REVIEW)`
    - Add `systemStatus SystemStatus @default(ACTIVE)`
    - *Note*: Keep `published` for now (marked `@deprecated`) to avoid immediate breakage, or remove if we are doing a hard cutover.
- **Commands**:
  - `npx prisma validate`
  - `npx prisma migrate dev --name add_governance_states`

---

## 2. Service Implementation (GovernanceService)
**Goal**: Centralize the complex visibility logic.

- **File**: `src/modules/governance/governance.service.ts`
- **Class**: `GovernanceService`
- **Methods**:
  1.  `getPublicFilter()`:
      - Returns the exact Prisma `where` clause for public-facing pages.
      - `{ editorialStatus: 'SUBMITTED', moderationStatus: 'APPROVED', systemStatus: 'ACTIVE' }`
  2.  `isVisible(entity: Property | Project)`:
      - Helper for UI/Frontend to check visibility without querying.
  3.  `submitForReview(id: number)`:
      - Sets `editorialStatus = SUBMITTED`, `moderationStatus = PENDING_REVIEW`.
  4.  `approve(id: number, adminId: number)`:
      - Sets `moderationStatus = APPROVED`.

---

## 3. Query Refactor (The Heavy Lift)
**Goal**: Update the entire application to use the new logic.

- **Public Views (`src/app/(frontend)/...`)**:
  - Search for `where: { published: true }`.
  - Replace with `where: { ...GovernanceService.getPublicFilter() }`.
- **Admin Dashboard (`src/app/admin/...`)**:
  - Update table columns to show all three statuses instead of just "Status".
  - Add filters for each status type (e.g., "Show PENDING_REVIEW").
- **User Dashboard (`src/app/(frontend)/account/...`)**:
  - Show explicit feedback: "Your listing is approved but hidden due to billing."

---

## 4. Data Migration
**Goal**: Map existing data to the new states.

- **Script**: `scripts/migrate_listing_status.ts`
- **Logic**:
  - **Batch 1 (Published)**:
    - Where `published = true`.
    - Update: `editorial=SUBMITTED`, `moderation=APPROVED`, `system=ACTIVE`.
  - **Batch 2 (Drafts/Hidden)**:
    - Where `published = false` AND `status = DRAFT`.
    - Update: `editorial=DRAFT`.
  - **Batch 3 (Pending)**:
    - Where `status = PENDING_REVIEW`.
    - Update: `editorial=SUBMITTED`, `moderation=PENDING_REVIEW`.
- **Verification**: Ensure total count of "Visible" listings matches before and after.

---

## 5. UI Updates
- **Property Card**: Update "Status" badge logic.
- **Publish Button**: Now triggers `editorialStatus = SUBMITTED`.
- **Admin Actions**: "Approve" and "Reject" buttons must update `moderationStatus`.

---

## 6. Verification
- **Test Case 1**: User submits property -> Status becomes `SUBMITTED` / `PENDING_REVIEW`.
- **Test Case 2**: Admin approves -> Status becomes `APPROVED`. Is it visible?
- **Test Case 3**: System status set to `INACTIVE_BILLING` -> Is it hidden?
- **Test Case 4**: Admin dashboard correctly filters by moderation status.
