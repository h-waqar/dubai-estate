# What to Test (QA Guide)

## 1. Registration & Login
✅ **Success**: User can sign up, receives email, and can log in.
❌ **Failure**: User cannot sign up with an existing email.
⚠️ **Edge Case**: Internet disconnects during sign up.

## 2. Property Submission
✅ **Success**: User submits property -> Status is "Pending" -> User cannot edit locked fields (if applicable).
❌ **Failure**: Submitting without required fields (Price, Title) shows an error message.
⚠️ **Edge Case**: Uploading 50+ large images.

## 3. Payments
✅ **Success**: PayPal popup opens, payment completes, plan is active.
❌ **Failure**: PayPal popup closes without payment -> Plan remains inactive.

## 4. Admin Approvals
✅ **Success**: Admin approves property -> Property appears on `/properties`.
✅ **Success**: Admin declines property -> Status changes to "Declined".
