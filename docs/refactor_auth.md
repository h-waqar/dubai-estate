# Auth System Refactor & Improvement Plan

## 1. Overview
This document outlines the plan to refactor and modernize the authentication system for Dubai Estate. The goals are to fix existing stability issues, implement a modern and accessible UI, integrate Google OAuth with extended profile data, and set up a robust notification system using Brevo (Email & SMS).

## 2. Objectives
-   **Stability:** Fix `OAuthCreateAccount` errors and database schema alignment.
-   **Modern UI:** Redesign Login, Register, Forgot Password, and Account pages with a minimalist, accessible aesthetic (Shadcn/UI + Tailwind).
-   **Features:**
    -   Google OAuth with profile syncing (First Name, Last Name, Username, Phone).
    -   Robust "Forgot Password" flow with token expiry.
    -   Account Management (Update profile, change password).
    -   Brevo Integration for transactional emails and newsletters.

## 3. Architecture & Tech Stack
-   **Auth:** NextAuth.js v4 (with Prisma Adapter).
-   **Database:** PostgreSQL (via Prisma).
-   **Email/SMS:** Brevo (via Nodemailer for SMTP / Brevo API for SMS).
-   **Frontend:** Next.js App Router, React Hook Form, Zod, Shadcn/UI.

## 4. Implementation Steps

### Phase 1: Database & Schema (High Priority)
- [x] **Fix Migration Drift:** Reset database and apply `update-user-for-oauth` migration to ensure `User` and `Account` tables match NextAuth expectations.
- [x] **Schema Updates:**
    -   Ensure `User` has `firstName`, `lastName`, `username`, `phoneNumber`, `passwordResetToken`, `passwordResetExpires`.
    -   Ensure `Account` and `Session` models are correct.
- [ ] **Validation:** Verify `npx prisma studio` shows the correct schema.

### Phase 2: Google OAuth Integration
- [x] **Client Setup:** Configure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- [x] **NextAuth Config:**
    -   Update `profile()` callback in `GoogleProvider` to map:
        -   `given_name` -> `firstName`
        -   `family_name` -> `lastName`
        -   `picture` -> `image`
        -   Generate unique `username` (e.g., `email_random4chars`) to prevent collisions.
- [ ] **Testing:** Verify logging in with a fresh Google account creates a user with all fields populated.

### Phase 3: Frontend Redesign (Modern & Accessible)
- [ ] **Login Page (`/login`):**
    -   Split layout (Hero image on left, Form on right).
    -   Clear error messages.
    -   "Remember Me" functionality.
- [ ] **Register Page (`/register`):**
    -   Multi-step or clean single-step form.
    -   Fields: First Name, Last Name, Email, Phone, Password.
    -   Real-time password strength indicator.
    -   Turnstile Captcha integration (fixed env var logic).
- [ ] **Forgot Password (`/forgot-password`):**
    -   Simple email input.
    -   Success state with "Check your email" animation.
- [ ] **Reset Password (`/reset-password`):**
    -   Token validation.
    -   New password input with confirmation.
- [ ] **User Dropdown:**
    -   Add "My Account" link.
    -   Show user avatar and truncated name.

### Phase 4: Account Management
- [ ] **Account Page (`/account`):**
    -   **Profile Tab:** Update Name, Phone, Bio.
    -   **Security Tab:** Change Password (requires current password).
    -   **Preferences:** Subscribe/Unsubscribe from newsletter.
- [ ] **Backend Actions:**
    -   `updateProfile`: Server Action to update user details.
    -   `changePassword`: Server Action to re-hash and update password.

### Phase 5: Notifications (Brevo)
- [ ] **Email Utility (`src/lib/email.ts`):**
    -   Enhance `sendEmail` to support templates.
    -   Implement `sendWelcomeEmail` (triggered on Register).
    -   Implement `sendPasswordResetEmail` (triggered on Forgot Password).
    -   Implement `sendLoginAlert` (optional security feature).
- [ ] **Newsletter:**
    -   Create `NewsletterSubscriber` model (already exists).
    -   Add "Subscribe to Newsletter" checkbox on Register.
    -   Sync contacts to Brevo Marketing API (optional).

## 5. Execution Order
1.  **DB Reset & Migration** (Done).
2.  **NextAuth Config Fix** (Done).
3.  **Frontend Redesign** (Login/Register/Forgot).
4.  **Backend Action Implementation** (Forgot/Reset Password).
5.  **Account Page Implementation**.
6.  **Brevo Integration Testing**.

## 6. Current Status
-   Database reset complete.
-   Register page Turnstile fixed.
-   NextAuth username generation fixed.
-   **Next Task:** Complete the Forgot Password flow (Backend Action & Email).
