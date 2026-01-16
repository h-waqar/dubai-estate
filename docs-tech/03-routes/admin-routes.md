# Admin Routes

These routes require `ADMIN` or `SUPER_ADMIN` roles.

| Route | Page Name | Access | Purpose | Actions / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | Admin Root | Admin | Redirect | Redirects to dashboard |
| `/admin/dashboard` | Admin Dashboard | Admin | System Overview | High-level stats |
| `/admin/users` | User Mgmt | Admin | Manage Users | Edit roles, ban users |
| `/admin/admins` | Admin Mgmt | Super Admin | Manage Admins | - |
| `/admin/properties` | All Properties | Admin | Listing Oversight | View all listings |
| `/admin/projects` | All Projects | Admin | Project Oversight | View all projects |
| `/admin/approvals` | Prop Approvals | Admin | Moderation | Approve/Decline properties |
| `/admin/project-approvals` | Proj Approvals | Admin | Moderation | Approve/Decline projects |
| `/admin/blog` | Blog Mgmt | Admin | Content | Manage posts |
| `/admin/categories` | Categories | Admin | Taxonomy | Manage blog/property categories |
| `/admin/media` | Media Library | Admin | Assets | Manage uploaded files |
| `/admin/developers` | Developers | Admin | Entities | Manage developer profiles |
| `/admin/features` | Features | Admin | Metadata | Manage property amenities |
| `/admin/property-types` | Property Types | Admin | Metadata | Manage types (Villa, Apt) |
| `/admin/pricing` | Pricing Plans | Admin | Revenue | Create/Edit PayPal Plans |
| `/admin/subscribers` | Subscribers | Admin | Revenue | View active subscriptions |
| `/admin/revenue` | Revenue Stats | Admin | Reports | Financial overview |
| `/admin/settings` | Settings | Admin | Config | System wide settings |

## Protection Mechanism
- **Layout**: `src/app/(frontend)/admin/layout.tsx` enforces session.
- **Additional Check**: Admin pages likely check `session.user.role` inside the page or a higher-order component (needs verification in code, likely in page logic).
