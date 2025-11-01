// src\utils\slug.ts
import { prisma } from "@/lib/prisma";

/**
 * Converts a string into a URL-friendly slug.
 * @param text The input string.
 * @returns The slugified string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[--]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generates a unique slug for a new entry, checking against existing slugs in the database.
 * @param title The title to slugify.
 * @returns A unique slug.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title);
  let count = 1;
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${count}`;
    count++;
  }
  return slug;
}
