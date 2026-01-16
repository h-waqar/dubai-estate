# Known Issues / Constraints

1.  **Middleware Absence**: No global `middleware.ts` was found in the root. Auth protection relies on Layouts and Server Actions. This is secure *if* implemented consistently, but risky if a new route forgets the check.
2.  **PayPal Webhooks**: No explicit webhook handler found. Subscription status updates might rely on login checks or manual syncs.
3.  **Soft Deletes**: Deletion logic (e.g., plans) attempts to check dependencies, but "Archive" vs "Delete" logic is partly manual.
4.  **Media Cleanup**: Deleting a property does not automatically delete images from Cloudinary (unless implemented in a hook not seen). DB records cascade delete, but remote files may persist.
