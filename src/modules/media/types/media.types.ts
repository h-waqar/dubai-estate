// src/modules/media/types/media.types.ts

export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";

export interface Media {
  id: number;
  url: string;
  type: MediaType;
  title?: string;
  alt?: string;
  mimeType?: string;
  size?: number; // in bytes
  uploadedById?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
