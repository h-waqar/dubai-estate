# MediaLibrary V2 Documentation

## 1. Overview

The **MediaLibrary V2** enhances the original system with **Batch Upload** and **Multi-Select** capabilities. It retains the core architecture (Prisma + Cloudinary) but significantly improves the user experience for content managers.

**Key V2 Features:**
*   **Batch Upload:** Upload up to 10 files simultaneously with parallel processing and individual status tracking.
*   **Multi-Select:** Support for selecting multiple media items at once for bulk insertion (e.g., into Galleries).
*   **Drag-and-Drop:** Enhanced upload interface supporting drag-and-drop for multiple files.
*   **Queue Management:** Robust queue system for managing upload progress and errors per file.

## 2. Updated Component Behaviors

### `MediaLibraryButton`
*   **Updated Props:**
    *   `selectionMode`: `"single"` (default) or `"multiple"`.
    *   `onSelect`: Callback now accepts `Media | Media[]`.
*   **Behavior:**
    *   If `selectionMode="multiple"`, the modal opens in multi-select mode.
    *   Consumer must handle `Media[]` in the callback.

### `MediaLibraryModal`
*   **New Props:** `selectionMode`.
*   **State:** Tracks `selectedItems` (Array) instead of single `selectedMedia`.
*   **Logic:** Handles toggling selection in "multiple" mode vs replacing selection in "single" mode.

### `MediaUploadView` (Completely Rewritten)
*   **Batch Support:** Accepts `multiple` files via input or drag-drop.
*   **Queue System:** Maintains a list of `UploadItem` objects with status (`PENDING`, `UPLOADING`, `SUCCESS`, `ERROR`).
*   **Concurrency:** Limits parallel uploads to 3 concurrent requests to prevent browser/server overload.
*   **Feedback:** Shows individual progress bars and error messages per file.
*   **Metadata:** Auto-populates Title from filename. Allows editing Title/Alt per file before or after upload (though editing during upload is disabled).

### `MediaGrid` & `MediaList`
*   **Selection:** Visual indicators for multiple selected items.

## 3. Data Flow Updates

### Batch Upload Flow
1.  **Selection:** User selects N files (Max 10).
2.  **Queue Creation:** Components creates N `UploadItem`s with `PENDING` status.
3.  **Start:** User clicks "Upload".
4.  **Processing:**
    *   Loop iterates through pending items.
    *   Up to 3 items are processed in parallel.
    *   Each item calls `uploadMedia` server action independently.
    *   On success, `addMedia` updates the global store (so items appear in Library immediately).
    *   On failure, item status updates to `ERROR` with message. Other items continue.
5.  **Completion:** User clicks "Back to Library" to see all new items.

## 4. Integration Guide

### Enabling Multi-Select
To enable multi-select for a gallery field:

```tsx
<MediaLibraryButton
  onSelect={(media) => {
    // Handle potential array
    const newItems = Array.isArray(media) ? media : [media];
    // Add to state...
  }}
  buttonText="Add Images"
  selectionMode="multiple" 
/>
```

### Handling Single Select (Backward Compatibility)
For single image fields (e.g., Cover Image), ensure safeguard against array:

```tsx
<MediaLibraryButton
  onSelect={(media) => {
    if (!Array.isArray(media)) {
      setCoverImage(media);
    }
  }}
  buttonText="Select Cover"
  // selectionMode defaults to "single"
/>
```

## 5. Constraints & Validations

*   **Batch Size:** Max 10 files per batch.
*   **Concurrency:** Max 3 parallel uploads.
*   **Video Duration:** Still capped at 90s (client-side check in batch loop).
*   **File Size:** Still capped at 75MB.

---
*Documentation updated for V2 features as of Jan 29, 2026.*
