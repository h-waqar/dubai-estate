# Phase 3: Listing State Refactor (Governance)

## Goals
- Implement Tri-State Governance for deterministic visibility.
- Remove ambiguity of the single `published` boolean.

## Logic
**Visible = Editorial(SUBMITTED) AND Moderation(APPROVED) AND System(ACTIVE)**

## Workflow

### 1. Schema Definition
- [ ] **Task 3.1: Prisma Schema Update**
  - **File**: `prisma/schema.prisma`
  - **Models**: `Property`, `Project`.
  - **Fields**:
    - `editorialStatus`: `DRAFT`, `SUBMITTED`, `ARCHIVED`.
    - `moderationStatus`: `PENDING_REVIEW`, `APPROVED`, `REJECTED`.
    - `systemStatus`: `ACTIVE`, `INACTIVE_BILLING`, `INACTIVE_QUOTA`.
  - **Migration**: `npx prisma migrate dev --name add_governance_states`.

### 2. Service Implementation
- [ ] **Task 3.2: Governance Service**
  - **File**: `src/modules/governance/governance.service.ts`
  - **Methods**:
    - `isVisible(entity)`: Checks the 3 flags.
    - `getPublicFilter()`: Returns the Prisma `where` clause for public queries.
      - Example: `{ editorialStatus: 'SUBMITTED', moderationStatus: 'APPROVED', systemStatus: 'ACTIVE' }`.

### 3. Query Refactor (The Big One)
- [ ] **Task 3.3: Update Public Queries**
  - **Scope**: All `findMany` calls for Properties/Projects in public pages.
  - **Action**: Replace `where: { published: true }` with `GovernanceService.getPublicFilter()`.

- [ ] **Task 3.4: Update Admin Queries**
  - **Scope**: Admin Dashboard.
  - **Action**: Expose the 3 statuses separately so Admins know *why* a listing is hidden.

### 4. Data Migration
- [ ] **Task 3.5: Migrate Existing Data**
  - **Script**: `scripts/migrate_listing_status.ts`
  - **Logic**:
    - If `published === true`:
      - `editorial = SUBMITTED`
      - `moderation = APPROVED`
      - `system = ACTIVE`
    - If `published === false`:
      - `editorial = DRAFT` (Safe default).
