Absolutely! I’ve prepared a comprehensive markdown documentation for your Media module, summarizing its current state, detected issues, and the full plan for fixes and enhancements. You can save this as MEDIA_MODULE_DOC.md in your repo.

Media Module Documentation
Table of Contents

Module Overview

Current Structure

Existing Functionality

Detected Issues & Vulnerabilities

Proposed Improvements

UI / UX Enhancements

Server / Service Hardening

Client / Hook Updates

Planned Implementation Details

Future Enhancements

References

Module Overview

The Media module is responsible for managing file uploads, storage, and display for images, videos, and documents within the Dubai Estate platform. It allows:

Uploading media (images, videos, PDFs, and other files)

Listing media items in a gallery

Deleting media

Client-side state management via Zustand

The module interacts directly with the Media and MediaUsage tables in PostgreSQL via Prisma.

Current Structure
src/modules/media/
├── actions/
│ ├── deleteMedia.ts
│ ├── listMedia.ts
│ └── uploadMedia.ts
├── components/
│ ├── MediaGallery.tsx
│ └── MediaUploader.tsx
├── hooks/
│ └── useMedia.ts
├── services/
│ └── service.ts
├── stores/
│ └── store.ts
├── types/
│ └── media.types.ts
└── validators/
└── media.validator.ts

Prisma Schema Highlights
model Media {
id Int @id @default(autoincrement())
url String
type MediaType @default(IMAGE)
alt String?
title String?
mimeType String?
size Int? // in bytes
uploadedById Int?
uploadedBy User? @relation(fields: [uploadedById], references: [id], onDelete: SetNull)
usages MediaUsage[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

enum MediaType {
IMAGE
VIDEO
DOCUMENT
OTHER
}

Existing Functionality

MediaUploader.tsx

Upload a file via input

Simple button to trigger handleUpload

No previews for images/videos before upload

Minimal fields: only file selected, no title/alt/type input

MediaGallery.tsx

Displays a grid of media

Only renders images

No video preview

Click handler for selectable mode

useMedia hook

Zustand-based store

Handles fetch (listMedia), upload (uploadMedia), delete (deleteMedia)

Maintains mediaList, loading, error

service.ts

Saves files to /public/uploads

Creates Prisma record

Deletes file + DB record

Uses synchronous fs writes (fs.writeFileSync)

Validators

Zod-based mediaUploadSchema (client-side)

Max file size: 10MB

Allowed types: jpeg/jpg/png/mp4/pdf

Detected Issues & Vulnerabilities
Category Issue Severity Notes
Security Raw file.name used in disk path High Risk of path traversal or special characters.
Performance fs.writeFileSync blocks Node worker High Should use async fs.promises.writeFile.
Security Trusting client-side mime/type High Need server-side validation; clients can spoof type.
Authorization No role checks High Any request can call save/delete without verification.
Memory Large files read into arrayBuffer Medium Could spike memory for big files; streaming suggested.
UX No file preview before upload Medium User cannot confirm file selection.
UX No video preview in gallery Medium Videos appear as blank placeholders.
UX No drag-and-drop / multi-file support Low Future enhancement.
Client file instanceof File fails in non-browser env Low Needs separate server validation.
Proposed Improvements
UI / UX Enhancements

MediaUploader

Add controlled form fields:

File (image/video/pdf)

Title (text, optional, max 150)

Alt (text, optional, max 150)

Type (select with options: IMAGE, VIDEO, DOCUMENT, OTHER; default auto-detected)

Show file metadata read-only:

Mime type

Size (KB/MB)

Preview:

Images: <img>

Videos: <video autoplay muted loop playsInline controls>

PDFs: filename or <iframe>/embed fallback

Revoke object URLs on unmount or new file selection

MediaGallery

Show video previews (muted autoplay, loop)

Maintain image previews

Accessibility: alt text, keyboard focus, aria-labels

Hover toolbar: select/delete actions

Server / Service Hardening

Use async fs.promises instead of writeFileSync

Sanitize filenames

Use path.basename + uuid for uploaded files

Validate server-side

Mime type, size, optional signature sniffing

Atomic operations

Save file → create DB record → rollback file if DB fails

Authorization

Only authenticated users with proper roles can upload/delete

Path traversal protection

Ensure uploadsDir and final file path are safe

Max file size enforcement on server

Future-proof for streaming uploads / S3 integration

Client / Hook Updates

useMedia:

Optimistic updates for upload/delete

Better error propagation

Clean up object URLs

Actions (uploadMedia, deleteMedia) use proper typed payloads

UI form wired to mediaUploadSchema (client-side) + server validation

Planned Implementation Details

MediaUploader

Form fields: File input + Title + Alt + Type

File preview (image/video/pdf)

Validation: client Zod + server-side check

Object URL cleanup

MediaGallery

Image/video rendering

Video autoplay muted loop

Accessible labels

Hover toolbar

Service

Async fs write

Filename sanitization

Atomic DB + file write

Server-side validation

Role check for uploadedById

Hooks / Actions

Updated to support new form fields and previews

Error handling and loading states improved

Optimistic state update on upload/delete

Future Enhancements

Drag-and-drop multi-file upload

Upload progress bar / streaming uploads

Thumbnail generation for images/videos

MediaUsage linking UI (assign media to entity + role)

CDN & caching headers

PDF previews in gallery

References

Prisma Docs: https://www.prisma.io/docs

Zod Docs: https://zod.dev

Zustand Docs: https://zustand-demo.pmnd.rs

Next.js File Upload Patterns: https://nextjs.org/docs/app/building-your-application/routing/server-actions

Security Best Practices:

Path traversal: https://owasp.org

File upload validation: https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload

Summary:

The current Media module is functional but lacks UX polish (previews, video support) and has some server-side risks (sync fs writes, filename sanitization, auth checks, client-trusted mime).

Our plan balances immediate UX improvements (previews, form fields) with server hardening (async writes, validation, sanitized filenames, auth). Once implemented, the module will be secure, user-friendly, and scalable for Dubai Estate’s media management.
