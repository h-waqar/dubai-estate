# Public Routes

| Route | Page Name | Access | Purpose | Actions / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Home | Everyone | Landing page | Search properties, view featured items |
| `/about` | About Us | Everyone | Company info | - |
| `/contact` | Contact Us | Everyone | Contact form | Submits to `actions/contact.ts` |
| `/blogs` | Blog List | Everyone | List articles | Filter by category |
| `/blogs/[slug]` | Blog Detail | Everyone | Read article | - |
| `/projects` | Projects List | Everyone | Off-plan projects | Filter projects |
| `/projects/[slug]` | Project Detail | Everyone | Project details | View floorplans, amenities |
| `/properties` | Properties List | Everyone | Live listings | Filter properties |
| `/properties/[slug]`| Property Detail | Everyone | Listing details | View gallery, contact agent |
| `/for-rent` | For Rent | Everyone | Pre-filtered list | Properties with `listingType=RENT` |
| `/for-sale` | For Sale | Everyone | Pre-filtered list | Properties with `listingType=SALE` |
| `/off-plan` | Off Plan | Everyone | Pre-filtered list | Off-plan projects |
| `/pricing` | Pricing | Everyone | Plan selection | View plans, proceed to subscription |
| `/advertise` | Advertise | Everyone | Info page | Info for developers/agents |
| `/login` | Login | Guest | Sign in | NextAuth Credentials login |
| `/register` | Register | Guest | Sign up | Create account, Captcha protected |
| `/forgot-password` | Forgot Password | Guest | Recovery | Request reset link |
| `/reset-password` | Reset Password | Guest | Recovery | Set new password |
