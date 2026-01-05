# Solved Issues

## Issue #23: Remove the Guides Link from Header & Add proper links in the Footer
- **Work Done**:
    - Removed the commented-out "Guides" link from `src/components/layout/Header.tsx`.
    - Updated `src/components/layout/Footer.tsx` to align property links with the application routes (`/for-sale`, `/for-rent`, `/off-plan`).
    - Replaced the "Areas" and "Resources" sections in the footer with a more relevant "Services" section.
    - Added links to "List Property" (`/advertise`) and "Off-Plan Projects" (`/projects`) in the footer.
    - Updated the "Company" section in the footer to include Privacy Policy and Terms of Service.
    - Removed the non-existent "Guides" link from the footer.

## Issue #24: Add proper icons in the Admin Panel
- **Work Done**:
    - Replaced all `react-icons/fa` icons in the admin sidebar (`src/components/dashboard/Sidebar.tsx`) with modern, consistent `lucide-react` icons.
    - Improved icon appropriateness for various sections (e.g., using `Home` for Property, `FolderTree` for Projects, `HardHat` for Developers).
    - Updated the sidebar component to use the `LucideIcon` type for better type safety.
    - Switched chevron icons to `lucide-react` versions for visual harmony.

## Issue #25: Add the user name who added the Project / Property
- **Work Done**:
    - Updated `src/modules/project/services/project.service.ts` to include the `createdBy` relation in the `listProjects` query.
    - Modified `src/app/(frontend)/admin/properties/page.tsx` to include an "Added By" column displaying the name and email of the user who created the property listing.
    - Modified `src/app/(frontend)/admin/projects/page.tsx` to include an "Added By" column displaying the name and email of the user who created the project listing.

## Issue #26: Add display which property / Project was approved by whom
- **Work Done**:
    - Updated `src/modules/project/services/project.service.ts` to include the `approvedBy` relation in the `listProjects` query.
    - Modified `src/app/(frontend)/admin/properties/page.tsx` to include an "Approved By" column showing which admin approved the property listing.
    - Modified `src/app/(frontend)/admin/projects/page.tsx` to include an "Approved By" column showing which admin approved the project listing.
    - Verified that existing approval pages (`src/app/(frontend)/admin/approvals/page.tsx` and `src/app/(frontend)/admin/project-approvals/page.tsx`) already display relevant agent/creator information.

## Issue #27: In property edit on /agent/dashboard the Location is not being updated on edit
- **Work Done**:
    - Improved the synchronization logic between the Zustand store and React Hook Form in `src/modules/property/components/advertise/steps/StepOneCreate.tsx`.
    - Added checks to prevent stale form values from overwriting fresh store updates from the `LocationSelector`.
    - Ensured `setValue` correctly triggers change events and validation for the hidden `location` field.

## Issue #29: In the Property Edit section some fields are not being pre populated
- **Work Done**:
    - Updated the hydration logic in `src/modules/property/components/advertise/AdvertiseWizard.tsx` to include missing fields: `developerId` and `proposedDeveloperName`.
    - This ensures that when editing a property, the existing developer information is correctly loaded into the form and store.

## Issue #30: Project Edit, there all the pre populated fields are missing fix that
- **Work Done**:
    - Added an `isLoaded` state and a loading spinner to `src/app/(frontend)/advertise/project/edit/[id]/ProjectEditWrapper.tsx`.
    - This ensures the `ProjectAdvertiseWizard` only renders AFTER the project data has been fully hydrated into the Zustand store, preventing the first step from rendering with empty default values.

## Issue #31: We have to make View Counter on the Properties
- **Work Done**:
    - Added a `views` field to the `Property` model in `prisma/schema.prisma`.
    - Created a server action `incrementPropertyViews` in `src/modules/property/actions/incrementPropertyViews.ts` to safely increment the view count.
    - Implemented a silent `ViewCounter` client component in `src/modules/property/components/ViewCounter.tsx` that triggers the view increment on mount.
    - Integrated the `ViewCounter` into the public property details page (`src/app/(frontend)/properties/[slug]/page.tsx`).
    - Added a "Views" column to the Admin Properties list to allow tracking popular listings.

## Issue #32: Right side Images in the Articles are stretched and blurry fix that
- **Work Done**:
    - Increased the resolution of sidebar thumbnails from 80px to 160px in `src/app/(frontend)/blogs/[slug]/page.tsx` to support high-DPI displays.
    - Added `quality={90}` to sidebar and author images to ensure crisp rendering.
    - Added `bg-muted` as a placeholder background to images during loading to prevent layout shifts and improve perceived performance.
    - Improved resolution for author images in both the meta info and the author card sections.

## Issue #16: In agent dashboard the stats should be real time
- **Work Done**:
    - Replaced mock statistics with real-time data from the database in `src/app/(frontend)/agent/dashboard/page.tsx`.
    - Implemented a unified "Total Views" counter that sums both property and project views.
    - Integrated lead tracking by counting `CallbackRequest` records associated with the logged-in agent.
    - Ensured stats are recalculated on every page load using Prisma queries.

## Issue #33: In property edit on /agent/dashboard the Location is not being updated on edit
- **Note**: This was a duplicate of Issue #27 and was resolved by the same fix.

## Issue #22: Payment Section / Revenue is missing add that
- **Work Done**:
    - Added a "Total Revenue" card to the Admin Dashboard stats using real-time calculations from `PricingPlan` associations.
    - Switched all dashboard icons to `lucide-react` for a consistent and modern look.
    - Implemented a dedicated "Revenue Analysis" page (`/admin/revenue`) showing MRR, subscribed users, ARPU, and revenue breakdown by plan.
    - Fully implemented the `PricingPlan` module (validators, services, and server actions) which was previously empty scaffolding.
    - Created a "Pricing Plans" management page (`/admin/pricing`) to allow admins to manage subscription tiers.
    - Updated the Admin Sidebar with a new "Finance" section containing Revenue and Pricing Plan links.





