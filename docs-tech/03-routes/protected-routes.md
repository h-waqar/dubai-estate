# Protected Routes

These routes require a valid session (`USER` role or higher).

| Route | Page Name | Access | Purpose | Actions / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/account` | Account Home | User | Redirect | Redirects to `/account/dashboard` |
| `/account/dashboard` | Dashboard | User | User Overview | View stats, recent activity |
| `/account/properties`| My Properties | User | Listing Mgmt | Create, Edit, Delete properties |
| `/account/projects` | My Projects | User | Project Mgmt | Manage developer projects |
| `/account/subscriptions` | Subscription | User | Billing | View plan, cancel subscription |
| `/select` | Role Selection? | User | Onboarding | Likely used after registration |

## Protection Mechanism
- **Client**: `src/app/(frontend)/account/layout.tsx` checks `useSession`. Redirects to login if missing.
- **Server**: Server Actions used on these pages (e.g., `createProperty`) check `getServerSession`.
