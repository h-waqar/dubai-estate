# Login & Sign Up

## Login
**URL**: `/login`
- **Fields**: Email, Password.
- **Action**: Signs the user in.
- **Redirect**: Goes to Dashboard upon success.

## Sign Up
**URL**: `/register`
- **Fields**: First Name, Last Name, Email, Phone, Password.
- **Security**: Requires completing a CAPTCHA.
- **Outcome**: Creates an account and sends a Welcome Email.

## Forgot Password
**URL**: `/forgot-password`
- **Action**: User enters email. System sends a reset link if the email exists.
