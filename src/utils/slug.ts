// src\utils\slug.ts

export function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/[^\w\-]+/g, "") // remove non-alphanumeric chars
    .replace(/\-\-+/g, "-"); // remove double dashes
}
