# Media Module Refactor Plan: Cloudinary Integration

This plan outlines the steps to migrate the `media` module from local file storage to Cloudinary.

## 1. Prerequisites & Dependencies

### 1.1. Install Cloudinary SDK
We need the official Node.js SDK for server-side uploads and management.
```bash
npm install cloudinary
```
*(Note: `next-cloudinary` is already installed, which is great for frontend optimization, but we need the core SDK for the server action).*

### 1.2. Environment Variables
Add the following to `.env`:
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 2. Database Schema Update

We need to store the Cloudinary `public_id` to efficiently manage (delete/transform) assets.

### 2.1. Modify `Media` Model in `prisma/schema.prisma`
```prisma
model Media {
  id           Int       @id @default(autoincrement())
  url          String
  publicId     String?   // <--- NEW FIELD: Stores Cloudinary Public ID
  type         MediaType @default(IMAGE)
  alt          String?
  title        String?
  mimeType     String?
  size         Int?      // in bytes
  uploadedById Int?
  uploadedBy   User?     @relation(fields: [uploadedById], references: [id], onDelete: SetNull)
  // ... rest same
}
```

### 2.2. Migration
Run `npx prisma migrate dev --name add_media_public_id` to apply changes.

## 3. Backend Implementation

### 3.1. Cloudinary Configuration (`src/lib/cloudinary.ts`)
Create a singleton configuration file for Cloudinary.

### 3.2. Update Service (`src/modules/media/services/service.ts`)

#### `saveMedia` Refactor
- **Current**: Writes file to `public/uploads`.
- **New**:
    1.  Convert `File` to `Buffer`.
    2.  Use `cloudinary.uploader.upload_stream` to upload the buffer.
    3.  Return the secure URL, public ID, format, and size.
    4.  Save `publicId` to the database.

#### `deleteMedia` Refactor
- **Current**: Deletes file from `public/uploads`.
- **New**:
    1.  Fetch `Media` record.
    2.  If `publicId` exists, call `cloudinary.uploader.destroy(publicId)`.
    3.  Delete record from DB.

### 3.3. Update Action (`src/modules/media/actions/uploadMedia.ts`)
- Ensure it passes the new data correctly. (Likely no major changes if service signature remains similar, but need to handle the buffer conversion carefully in the service).

## 4. Frontend Implementation

### 4.1. Image Optimization & Caching
The user requested "proper caching so it only loads once".
- **Cloudinary CDN**: Cloudinary automatically caches assets on their CDN.
- **Next.js Image**: We can use `next/image` (or `next-cloudinary`'s `CldImage`) which handles optimization and caching.
- **Update `MediaPreview.tsx`**:
    - For `IMAGE`: Use `next/image` with the Cloudinary URL.
    - For `VIDEO`: Use standard `<video>` tag (Cloudinary URLs support streaming).
    - For `PDF`: Link to the resource.

### 4.2. Next.js Config
Ensure `res.cloudinary.com` is allowed in `next.config.ts`. (It is currently `**`, so it's covered, but being explicit is good).

## 5. Migration Strategy (New vs. Old)
- **New Files**: Will go to Cloudinary.
- **Old Files**:
    - The new code should handle legacy files (where `publicId` is null).
    - If `publicId` is null, `deleteMedia` should try to delete from disk (legacy fallback).
    - `saveMedia` will only do Cloudinary.

## 6. Execution Steps
1.  Install `cloudinary`.
2.  Update `prisma/schema.prisma` and run migration.
3.  Create `src/lib/cloudinary.ts`.
4.  Refactor `src/modules/media/services/service.ts`.
5.  Verify `uploadMedia` action compatibility.
6.  Update `MediaPreview.tsx` to ensure optimized rendering.
7.  Test upload and delete flows.
