// =============================================================================
// FILE: src/modules/media/utils/formatFileSize.ts
// =============================================================================
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
