/**
 * Generates a random UUID (v4).
 * Falls back to a Math.random-based implementation if crypto.randomUUID is not available.
 * Useful for non-secure contexts (HTTP) or older browsers.
 */
export function generateUUID(): string {
  // Check if we are in a browser environment and randomUUID is available
  if (
    typeof window !== 'undefined' && 
    window.crypto && 
    // @ts-ignore - randomUUID might not be in all type definitions yet
    typeof window.crypto.randomUUID === 'function'
  ) {
    // @ts-ignore
    return window.crypto.randomUUID();
  }

  // Fallback implementation (RFC4122 v4 compliant-ish)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
