// src\lib\utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(url: string | null | undefined) {
  if (!url) return "/assets/images/nopropertyfound.jpg";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return `/uploads/${encodeURIComponent(url)}`;
}
