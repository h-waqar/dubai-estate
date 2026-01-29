# MediaLibrary Documentation

## 1. Overview

The **MediaLibrary** is a centralized system for managing, uploading, and selecting media assets (images, videos, documents) within the application. It acts as a bridge between the application's data layer (Prisma), the object storage provider (Cloudinary), and the frontend user interface.

**Key responsibilities:**
*   **Centralized Asset Management:** Provides a unified interface to upload and browse media.
*   **Integration:** Handles the complexity of Cloudinary uploads, including optimizations and transformations.
*   **Metadata Storage:** Persists media metadata (URL, public ID, alt text, dimensions) in the PostgreSQL database via Prisma.
*   **Reusability:** Offers a modular modal component (`MediaLibraryModal`) that can be integrated into any form (Properties, Projects, Blogs) to select media.

## 2. Complete File Inventory

### UI Components (`src/modules/media/components/`)
*   `MediaLibraryButton.tsx`: The primary trigger component; renders a button that opens the `MediaLibraryModal`.
*   `MediaLibraryModal.tsx`: The main container component; manages the "Library" vs. "Upload" tabs and overall modal state.
*   `MediaLibraryTabs.tsx`: Navigation component for switching between "Library" and "Upload" views.
*   `MediaLibraryContent.tsx`: Logic component that renders either `MediaLibraryView` or `MediaUploadView` based on the active tab.
*   `MediaLibraryView.tsx`: Displays the grid or list of existing media items with filtering and search capabilities.
*   `MediaUploadView.tsx`: Handles file selection, client-side validation, preview, metadata input, and the upload process.
*   `MediaGrid.tsx`: Renders media items in a grid layout.
*   `MediaList.tsx`: Renders media items in a list layout.
*   `MediaToolbar.tsx`: Provides search, view mode toggles, and type filtering controls.
*   `MediaFooter.tsx`: Handles the "Insert" or "Cancel" actions at the bottom of the modal.
*   `MediaLoadingState.tsx`: UI skeleton loader for fetching media.
*   `MediaErrorState.tsx`: UI for displaying fetch errors.
*   `MediaEmptyState.tsx`: UI displayed when no media is found.

### Standalone Components
*   `src/components/ui/avatar-upload.tsx`: A simplified, standalone upload component for user avatars that bypasses the central media store and database recording.

### Hooks & State (`src/modules/media/`)
*   `hooks/useMedia.ts`: Custom React hook that connects components to the Zustand store and server actions (`fetchMedia`, `handleUpload`, `handleDelete`).
*   `stores/store.ts`: Zustand store (`useMediaStore`) managing the global state of the media list, loading status, and errors.

### Server Actions (`src/modules/media/actions/`)
*   `uploadMedia.ts`: Server Action validating input and delegating to the service layer to save media (DB + Cloudinary).
*   `upload.action.ts`: Simpler Server Action used by `AvatarUpload` for direct Cloudinary uploads without DB persistence.
*   `listMedia.ts`: Server Action to fetch media records from the database.
*   `deleteMedia.ts`: Server Action to remove media from the database and Cloudinary.

### Service Layer & Utilities
*   `src/modules/media/services/service.ts`: Core logic handling Cloudinary interactions (upload, delete), file processing, configuration (`MEDIA_CONFIG`), and Prisma database operations.
*   `src/lib/cloudinary.ts`: Cloudinary SDK configuration.
*   `src/modules/media/validators/media.validator.ts`: Zod schemas for validating upload requests.
*   `src/modules/media/types/media.types.ts`: TypeScript interfaces and types for Media objects.

## 3. Component Breakdown

### MediaLibraryButton
*   **Purpose:** Triggers the Media Library modal.
*   **Props:** `onSelect` (callback), `mode` ("select" or "manage"), `scope` ("USER" or "GLOBAL").
*   **Workflow:** Manages local `isOpen` state. When clicked, renders the `MediaLibraryModal`.

### MediaLibraryModal
*   **Purpose:** Orchestrates the media selection workflow.
*   **State:** Manages `activeTab` ("library" | "upload") and `selectedMedia`.
*   **Workflow:** Fetches media via `useMedia` on mount. Passes selection handlers down to children.

### MediaUploadView
*   **Purpose:** Handles the creation of new media assets.
*   **State:** Manages file selection, preview URLs, and metadata inputs (Title, Alt).
*   **Interaction:** Calls `useMedia.handleUpload`.
*   **Validation:** Performs client-side checks for file size (75MB limit), type, and video duration (90s limit).

### MediaLibraryView
*   **Purpose:** Browses existing assets.
*   **State:** Manages local search query and filter state (`searchQuery`, `viewMode`, `filterType`).
*   **Workflow:** Filters the `mediaList` from the global store based on local state and passes results to `MediaGrid`/`MediaList`.

## 4. Services & External Integrations

### Service Layer (`src/modules/media/services/service.ts`)
This file contains the core business logic.
*   **`saveMedia`**:
    *   **Validates** file size against `MEDIA_CONFIG.MAX_FILE_SIZE` (75MB).
    *   **Uploads** to Cloudinary using `upload_stream`.
    *   **Configures** Cloudinary optimizations:
        *   **Images**: Applies resizing (`1920x1080` limit), quality (`auto:good`), and format (`webp`) transformations.
        *   **Videos**: Uses eager async transformations to generate optimized versions (`webm`, `1m` bitrate) while returning the immediate public ID.
    *   **Persists** the result to the PostgreSQL `Media` table via Prisma.
    *   **Returns** the created Prisma `Media` object.
*   **`deleteMedia`**:
    *   Deletes the asset from Cloudinary using `uploader.destroy`.
    *   Deletes the record from the Prisma database.
*   **`listMedia`**:
    *   Fetches records from Prisma.
    *   Implements basic scoping (USER vs GLOBAL) based on `uploadedById`.

### Cloudinary Integration
*   **Config**: Defined in `src/lib/cloudinary.ts` using environment variables.
*   **Folder Structure**: Assets are organized into `dubai-estate/images`, `dubai-estate/videos`, etc., based on MIME type.
*   **Optimization**: Heavy reliance on Cloudinary's on-the-fly transformations and eager processing for videos to ensure performance.

## 5. Data Flow & Control Flow

### Upload Lifecycle (Standard Flow)
1.  **User Action**: User selects a file in `MediaUploadView`.
2.  **Client Validation**: Component checks file type, size (75MB), and video duration (90s).
3.  **Initiation**: User clicks "Upload". `useMedia.handleUpload` is called.
4.  **Server Action**: `uploadMedia` action receives `FormData`.
5.  **Zod Validation**: Server validates payload against `mediaUploadSchema`.
6.  **Service Processing (`saveMedia`)**:
    *   File buffer is streamed to Cloudinary.
    *   Cloudinary processes file (resizing/formatting).
    *   Cloudinary returns metadata (`secure_url`, `public_id`, `bytes`).
    *   Service creates a new row in `Media` table with this metadata.
7.  **Response**: The new `Media` object is returned to the client.
8.  **State Update**: `useMedia` hook adds the new object to the Zustand store's `mediaList`.
9.  **UI Update**: `MediaUploadView` calls `onUploadSuccess`, switching the tab back to "Library".

### Avatar Upload Lifecycle (Bypassed Flow)
1.  **User Action**: User selects file in `AvatarUpload`.
2.  **Action**: `uploadImageAction` is called directly.
3.  **Processing**: Image is uploaded to Cloudinary folder `dubai-estate/avatars`.
4.  **Response**: Returns `{ url: string }`.
5.  **Result**: URL is used immediately; no database record is created in the `Media` table.

## 6. State Management

*   **Global State**: Managed by **Zustand** (`src/modules/media/stores/store.ts`).
    *   `mediaList`: Array of `Media` objects.
    *   `loading`: Boolean flag for async operations.
    *   `error`: String for error messages.
*   **Scope**: The store is client-side global but populated via the `useMedia` hook which is often scoped to the `MediaLibraryModal` lifecycle.
*   **Mutations**:
    *   `setMediaList`: Replaces entire list (on fetch).
    *   `addMedia`: Prepends new item (on upload).
    *   `removeMedia`: Filters out item (on delete).

## 7. Error Handling & Edge Behavior

*   **Client-Side**:
    *   **File Type**: Checks MIME types before upload. Displays error "Unsupported file type".
    *   **File Size**: Checks against 75MB limit. Displays error "File is too large".
    *   **Video Duration**: Checks video metadata. Displays warning/error if > 90s.
*   **Server-Side**:
    *   **Validation**: Zod schema throws errors for invalid inputs.
    *   **Upload Failures**: `try/catch` blocks wrap Cloudinary calls. Errors are caught, logged, and re-thrown as generic server errors or specific messages.
    *   **Video Duration (Post-Upload)**: If Cloudinary reports a duration > 90s after upload, the asset is immediately destroyed, and an error is thrown to prevent storage.

## 8. Security & Constraints (Observed)

*   **Authentication**: `uploadMedia` checks `getServerSession`. Uses `session.user.id` to populate `uploadedById`.
*   **File Limits**:
    *   **Size**: Hardcoded to 75MB (`MEDIA_CONFIG.MAX_FILE_SIZE`).
    *   **Video Length**: Hardcoded to 90 seconds.
*   **Access Control**:
    *   `listMedia` logic implies a "USER" scope (users see their own uploads) vs "GLOBAL" scope (Admin view), though the enforcement relies on the caller passing the correct scope arguments.
    *   Cloudinary uploads are generally public (`secure_url` is returned).

## 9. Known Limitations (Code-Derived)

*   **Hardcoded Config**: Configuration values (75MB, 90s, resolution limits) are hardcoded in `service.ts` and duplicated in `MediaUploadView.tsx`, leading to potential sync issues.
*   **Avatar Disconnect**: Avatar uploads are not tracked in the `Media` table, meaning they cannot be managed or reused via the Media Library.
*   **Video Processing**: Video upload relies on a synchronous Promise wrapper around a stream. For large files, this might timeout Vercel functions (Serverless usually has 10-60s timeouts).
*   **Search**: Search is purely client-side (`MediaLibraryView.tsx` filters the loaded array). This will not scale if the user has hundreds of media items.

## 10. Suggestions for Improvement (NON-BINDING)

1.  **Unified Configuration**: Move `MEDIA_CONFIG` to a shared constant file accessible by both Client and Server to ensure validation rules (size limits, allowed types) remain in sync.
2.  **Server-Side Search**: Implement search and pagination in `listMedia` and the Prisma query to handle large datasets efficiently.
3.  **Avatar Unification**: Refactor `AvatarUpload` to use the standard `uploadMedia` flow (perhaps with a specific "AVATAR" type) so user profile images are managed centrally.
4.  **Async Uploads**: For larger video files, consider a direct-to-Cloudinary signed upload from the client (bypassing the Next.js server) to avoid serverless timeout limits.
5.  **Orphaned File Cleanup**: Implement a cron job or logic to detect and remove Cloudinary assets that exist in the `Media` table but are no longer referenced by any entity (Property, Project, etc.).

---
*Documentation generated based on codebase analysis as of Jan 29, 2026.*
