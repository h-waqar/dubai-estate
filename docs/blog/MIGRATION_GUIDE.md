# Database Migration Guide

## Add publishedAt field to Post model

### 1. Update your Prisma schema

Add the `publishedAt` field to your `Post` model in `prisma/schema.prisma`:

```prisma
model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  content     String    @db.Text
  excerpt     String?   @db.Text
  coverImage  String?
  category    String?
  tags        String[]
  published   Boolean   @default(false)
  publishedAt DateTime? // Add this line
  authorId    Int
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### 2. Create and run migration

```bash
# Create migration
npx prisma migrate dev --name add_published_at

# Or if in production
npx prisma migrate deploy
```

### 3. Update existing published posts (optional)

If you have existing published posts and want to set their `publishedAt` date:

```sql
-- Run this SQL directly or create a script
UPDATE "Post"
SET "publishedAt" = "createdAt"
WHERE published = true AND "publishedAt" IS NULL;
```

## File Structure Created

```
app/
├── (frontend)/
│   ├── admin/
│   │   └── blog/
│   │       └── page.tsx              # Updated with BlogList component
│   └── blogs/
│       └── [slug]/
│           ├── page.tsx               # Public blog view
│           └── not-found.tsx          # 404 page for blogs
├── api/
│   └── posts/
│       └── [id]/
│           ├── route.ts               # Existing CRUD operations
│           └── publish/
│               └── route.ts           # New: Publish toggle endpoint
components/
└── blog/
    └── BlogList.tsx                   # New: Main blog listing component
```

## Component Usage

### BlogList Component Features

- ✅ Table layout with cover images
- ✅ Search functionality
- ✅ Category and status filters
- ✅ Pagination (10 items per page)
- ✅ Actions: Edit, Delete, View, Duplicate, Publish/Unpublish
- ✅ Stats dashboard (Total, Published, Drafts)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Toast notifications

### Public Blog Page Features

- ✅ SEO optimized with metadata
- ✅ Responsive design
- ✅ Reading time estimation
- ✅ Author card
- ✅ Related posts section
- ✅ Social sharing ready
- ✅ Breadcrumb navigation

## Next Steps

1. **Install missing dependencies** (if any):

   ```bash
   npm install sonner
   ```

2. **Verify all shadcn/ui components are installed**:

   ```bash
   npx shadcn-ui@latest add dropdown-menu
   npx shadcn-ui@latest add select
   ```

3. **Add Toaster to your root layout** if not already added:

   ```tsx
   // app/layout.tsx
   import { Toaster } from "@/components/ui/sonner";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Toaster />
         </body>
       </html>
     );
   }
   ```

4. **Update your API base URL** in `lib/api.ts` if needed to ensure it points to the correct endpoint.

## Testing Checklist

- [ ] Blog listing page loads with all posts
- [ ] Search filters posts correctly
- [ ] Category filter works
- [ ] Status filter (Published/Draft) works
- [ ] Pagination navigates correctly
- [ ] Edit button redirects to edit page
- [ ] Delete button removes post with confirmation
- [ ] Publish toggle changes post status
- [ ] Duplicate creates copy of post
- [ ] View button opens public blog page
- [ ] Public blog page displays correctly
- [ ] Related posts show up
- [ ] Dark mode works on all pages

## Troubleshooting

### Issue: "sonner not found"

```bash
npm install sonner
```

### Issue: Cover images not displaying

- Verify `coverImage` URLs are valid
- Check Next.js Image domains in `next.config.js`:

```js
images: {
  domains: ['your-image-domain.com'],
}
```

### Issue: Pagination not working

- Ensure `filteredPosts.length` is correct
- Check console for any errors

### Issue: Public blog page shows 404

- Verify the post has `published: true`
- Check the slug is correct
- Ensure the file is at `app/(frontend)/blogs/[slug]/page.tsx`
