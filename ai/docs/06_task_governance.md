# Task 06: Listing State Refactor (Tri-State Governance)

## What Was Done
- Implemented Tri-State Governance to remove ambiguity from the legacy `published` boolean.
- Visibility is now determined by: `EditorialStatus` (User Intent) AND `ModerationStatus` (Admin Approval) AND `SystemStatus` (Billing/Quota).
- Refactored public queries across Property and Project domains to use the new governance logic.
- Updated Admin and User dashboards to provide granular visibility into listing states.

## Files Modified/Created
- `src/modules/governance/governance.service.ts`: Centralized visibility logic and status update methods.
- `src/modules/project/services/project.service.ts`: Updated `listProjects` to support tri-state filtering.
- `src/actions/location.ts`: Refactored public location search to use `getPublicFilter`.
- `src/modules/project/services/developer.service.ts`: Updated developer project listings to respect governance.
- `src/app/(frontend)/admin/properties/page.tsx`: Added Editorial, Moderation, and System status columns.
- `src/app/(frontend)/admin/projects/page.tsx`: Added Editorial, Moderation, and System status columns.
- `src/app/(frontend)/projects/page.tsx`: Simplified public project query.
- `scripts/migrate_listing_status.ts`: Created/Updated migration script to backfill governance states from legacy `published` field.

## Functions/Components Written
- `GovernanceService.getPublicFilter()`: Returns Prisma `where` clause for public visibility.
- `GovernanceService.isVisible()`: Client-side visibility check.
- `ProjectService.listProjects()`: Enhanced with governance awareness.

## Key Decisions
- **Backward Compatibility**: Maintained the legacy `published` and `status` fields in sync within the service layer to prevent immediate breakage in un-refactored parts of the system, but marked them as deprecated.
- **Admin Visibility**: Decided to show all three statuses in admin tables to allow quick debugging of "hidden" listings.

## Testing Considerations
- Verified that items with `systemStatus: INACTIVE_BILLING` are hidden from public view even if approved.
- Verified that items in `DRAFT` editorial status are hidden from public view.
- Admin dashboard correctly filters and displays the granular statuses.
