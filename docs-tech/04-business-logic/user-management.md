# User Management

## Registration
- **Form**: `src/app/(frontend)/(auth)/register`.
- **Action**: `registerUser`.
- **Validation**: Zod + Turnstile Captcha.
- **Email**: Sends welcome email.

## Roles & Permissions
- **Storage**: `roles` array in `User` model (PostgreSQL Array).
- **Default**: `["USER"]`.
- **Admin**: Can assign roles via `/admin/users`.

## Profile
- **Model**: `Profile` (One-to-One with User).
- **Updates**: Users can update basic info (Name, Phone) via `/account`.

## Security
- **Passwords**: Hashed with `bcryptjs`.
- **Reset**: Token-based flow (`passwordResetToken` in DB).
