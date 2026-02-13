# Phase 0: Baseline & Safety Net

## Goals
- Establish a known good state before major refactoring.
- Ensure data integrity can be verified post-migration.
- Prepare the development environment.

## Workflow

- [ ] **Task 0.1: System Snapshot**
  - **Description**: Capture the current state of critical metrics.
  - **Action**: Run SQL queries to count:
    - Active Subscriptions per plan.
    - Active/Published Properties.
    - Active/Published Projects.
  - **Output**: Save to `ai/plan/phase0/baseline_metrics.json`.

- [ ] **Task 0.2: Database Backup**
  - **Description**: Create a manual backup of the production/dev database.
  - **Action**: Use `pg_dump` or Prisma to save a snapshot.
  - **Constraint**: Do not proceed without this.

- [ ] **Task 0.3: Test Suite Verification**
  - **Description**: Ensure all existing tests pass.
  - **Action**: Run `npm run test` (if available) or verify build `npm run build`.
  - **Note**: Fix any existing broken builds before starting Phase 1.

- [ ] **Task 0.4: Branching**
  - **Description**: Create a dedicated feature branch for the refactor.
  - **Action**: `git checkout -b refactor/ledger-system`.
