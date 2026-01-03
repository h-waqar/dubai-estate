# Media Module Refactor Plan: Cloudinary Integration

This plan outlines the complete migration of the `media` module from local file storage to Cloudinary, ensuring RBAC (Role-Based Access Control) and optimized asset management.

## 1. Architecture & Flow

### 1.1 Upload Flow (With Compression)
```ascii
[User] 
  │ 
  ▼ (Select File)
[Frontend Component]
  │
  ▼ (Server Action: uploadMedia)
[Backend Service: saveMedia]
  │
  ├──► Check File Type (Image/Video/PDF)
  │     │
  │     ├──► Image? ──► Folder: "dubai-estate/images"
  │     ├──► Video? ──► Folder: "dubai-estate/videos"
  │     └──► PDF?   ──► Folder: "dubai-estate/documents"
  │
  ▼
[Cloudinary SDK] ───(Upload Stream)───► [Cloudinary Storage]
  │                                         │
  │                                         ├──► Apply Auto-Compression (q_auto)
  │                                         ├──► Apply Auto-Format (f_auto)
  │                                         │
  │                                         ▼
  └─────────────────────────────────── [Returns: URL, PublicID]
  │
  ▼
[Prisma DB] ──► Create Media Record (url, publicId, type, uploadedById)
```

### 1.2 Access Control (RBAC) Logic
```ascii
[User Request: listMedia]
  │
  ├──► Route: /admin/media?  (Is this the Global Admin Library?)
  │      │
  │      ├──► YES ──► Call listMedia(scope: 'GLOBAL')
  │      │              │
  │      │              ▼
  │      │          [Check Role]
  │      │            ├──► ADMIN? ──► [Fetch ALL Media]
  │      │            └──► USER?  ──► [Error / Fallback to Own]
  │      │
  │      └──► NO  ──► Call listMedia(scope: 'USER')
  │                     │
  │                     ▼
  │                 [Fetch WHERE uploadedById == user.id]
  │                 (Used for Profile, Property Editor, etc.)
```

### 1.3 Deletion Flow
```ascii
[User Request: deleteMedia(id)]
  │
  ▼
[Backend Service]
  │
  ├──► 1. Fetch Media Record from DB
  │
  ├──► 2. Get `publicId`
  │
  ├──► 3. Call Cloudinary API ──► Destroy Asset (publicId)
  │
  └──► 4. Delete Record from DB
```

## 2. Prerequisites & Configuration

### 2.1 Dependencies
Ensure `cloudinary` and `next-cloudinary` are installed (Confirmed).

### 2.2 Environment Variables
The following variables are implemented in `.env`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<your-cloud-name>"
CLOUDINARY_API_KEY="<your-api-key>"
CLOUDINARY_API_SECRET="<your-api-secret>"
CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
```

### 2.3 Cloudinary Config Instance
Create `src/lib/cloudinary.ts` to export a configured instance.
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
```

## 3. Database Updates

### 3.1 Schema Modification
Update `Media` model in `prisma/schema.prisma` to store the `publicId`.

```prisma
model Media {
  id           Int       @id @default(autoincrement())
  url          String
  publicId     String?   // Store Cloudinary Public ID for deletion
  type         MediaType @default(IMAGE)
  // ... existing fields
}
```

### 3.2 Migration
Run: `npx prisma migrate dev --name add_media_public_id`

## 4. Backend Implementation (`src/modules/media/services/service.ts`)

### 4.1 Helper: `getFolder(mimeType)`
```typescript
const getFolder = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'dubai-estate/images';
  if (mimeType.startsWith('video/')) return 'dubai-estate/videos';
  if (mimeType === 'application/pdf') return 'dubai-estate/documents';
  return 'dubai-estate/others';
}
```

### 4.2 Refactor `saveMedia`
1.  **Input**: Receive `File` object + metadata.
2.  **Conversion**: Convert `File` to `Buffer` -> `Stream`.
3.  **Upload & Compression**:
    *   Use `cloudinary.uploader.upload_stream`.
    *   **Configuration**:
        *   `folder`: Use logic from 4.1.
        *   `resource_type`: "auto" (or specific).
        *   **Optimization**: `quality: "auto"`, `fetch_format: "auto"` (This ensures compression and optimal format selection).
4.  **DB Create**: Store `secure_url` as `url` and `public_id`.

### 4.3 Refactor `listMedia`
1.  **Input**: `userId`, `role`, `scope` ("GLOBAL" | "USER").
2.  **Logic**:
    *   **Default**: Fetch `where: { uploadedById: userId }`.
    *   **Override**: If `scope === 'GLOBAL'` AND `role === 'ADMIN'`, fetch All.
    *   This ensures that even Admins see only their own files in normal contexts (e.g., creating a post), and only see ALL files in the `/admin/media` dashboard.

### 4.4 Refactor `deleteMedia`
1.  **Fetch**: Get media by ID.
2.  **Cloudinary Delete**:
    *   `if (media.publicId)` -> `cloudinary.uploader.destroy(media.publicId)`.
    *   **Fallback**: If `publicId` is missing (legacy files), attempt local file deletion.
3.  **DB Delete**: Remove record.

## 5. Frontend Updates

### 5.1 Media Library View
*   **Context Aware**: The Media Library component needs to know where it's being rendered.
*   **Props**: Add `mode: 'global' | 'personal'` prop to `MediaLibraryView`.
*   **Route `/admin/media`**: Pass `mode="global"`.
*   **Other Routes (Property Edit, Blog Edit)**: Pass `mode="personal"` (or default).
*   **Action Call**: Pass this mode to the server action, which forwards it to the service.

### 5.2 Image Rendering
*   Use `next/image` with the Cloudinary URL.
*   `next-cloudinary`'s `CldImage` can be used for advanced transformations if needed later.

## 6. Migration Strategy (Legacy Data)

### 6.1 Phase 1: Hybrid Mode
*   New uploads go to Cloudinary.
*   Old uploads (local) still work (served via `public/uploads`).
*   `deleteMedia` handles both.

### 6.2 Phase 2: Migration Script (Future Task)
*   Script to iterate over DB records where `publicId` is null.
*   Upload local file to Cloudinary.
*   Update DB with new URL and `publicId`.
*   Delete local file.

## 7. Execution Checklist

- [ ] Update `prisma/schema.prisma` & Migrate.
- [ ] Create `src/lib/cloudinary.ts`.
- [ ] Refactor `src/modules/media/services/service.ts` (Implement Compression & new RBAC).
- [ ] Update `src/modules/media/actions/listMedia.ts` (Accept scope param).
- [ ] Update `src/app/admin/media/page.tsx` (or equivalent) to request GLOBAL scope.
- [ ] Update `src/modules/media/components/MediaLibraryView.tsx` to accept mode prop.
- [ ] Test Upload (Image, Video, PDF + Compression check).
- [ ] Test RBAC (Admin route vs Normal route).
- [ ] Test Deletion.
