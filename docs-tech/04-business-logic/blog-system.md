# Blog System

## Overview
A comprehensive CMS for publishing articles (`Post`).

## Features
- **Rich Text**: Tiptap editor with image support.
- **Taxonomy**: Categories (`Category` model) and Tags.
- **Media**: Integrated with `Media` library (Cloudinary).
- **SEO**: Slugs generated from titles.

## Architecture
- **Module**: `src/modules/blog`.
- **Permissions**:
    - `ADMIN`/`EDITOR`: Can create, edit, publish any post.
    - `WRITER`: Can create drafts, requires approval to publish (logic dependent on specific permission implementation).

## Publishing Flow
1.  **Draft**: Created with `published: false`.
2.  **Publish**: Admin toggles status. `publishedAt` is set.
3.  **Public View**: `/blogs` only fetches `published: true`.
