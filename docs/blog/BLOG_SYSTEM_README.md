# Dubai Estate - Blog System Documentation

## 🎉 Complete Blog Management System

A comprehensive, production-ready blog system with admin dashboard and public viewing pages.

## 📁 File Structure

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── admin/
│   │   │   └── blog/
│   │   │       ├── page.tsx              # Admin blog list
│   │   │       ├── new/
│   │   │       │   └── page.tsx          # Create new post
│   │   │       └── edit/
│   │   │           └── [id]/
│   │   │               └── page.tsx      # Edit existing post
│   │   └── blogs/
│   │       └── [slug]/
│   │           ├── page.tsx              # Public blog view
│   │           └── not-found.tsx         # 404 handler
│   └── api/
│       └── posts/
│           ├── route.ts                  # GET all, POST new
│           └── [id]/
│               ├── route.ts              # GET one, PUT, DELETE
│               └── publish/
│                   └── route.ts          # PATCH toggle publish
├── components/
│   └── blog/
│       └── BlogList.tsx                  # Main listing component
└── types/
    └── post.ts                           # TypeScript interfaces
```

## 🚀 Features

### Admin Dashboard (`/admin/blog`)

- **Modern Table Layout** with cover image thumbnails
- **Advanced Filtering**:
  - Real-time search (title & content)
  - Category filter
  - Status filter (Published/Draft)
- **Pagination**: 10 items per page with navigation
- **Statistics Dashboard**:
  - Total posts count
  - Published posts count
  - Draft posts count
- **Post Actions**:
  - ✏️ Edit - Navigate to edit page
  - 🗑️ Delete - Remove post with confirmation
  - 👁️ View - Open public blog page
  - 📋 Duplicate - Create copy of post
  - ✅/❌ Publish/Unpublish - Toggle status

### Public Blog View (`/blogs/[slug]`)

- **SEO Optimized**: Dynamic meta tags and Open Graph
- **Rich Content Display**:
  - Hero section with cover image
  - Reading time estimation
  - Author information card
  - Category and tags display
- **Related Posts**: Shows 3 related articles from same category
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Full theme compatibility

## 🎨 UI Components Used

- `Badge` - Category and tag display
- `Button` - Actions and navigation
- `Input` - Search functionality
- `Select` - Filters
- `DropdownMenu` - Additional actions
- `Dialog` - Confirmations (via toast)
- `Toaster` - Notifications (sonner)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
# Install sonner for toast notifications
npm install sonner

# Verify shadcn/ui components (if missing)
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
```

### 2. Update Prisma Schema

Add `publishedAt` field to your Post model:

```prisma
model Post {
  // ... existing fields
  publishedAt DateTime?
  // ... rest of fields
}
```

Run migration:

```bash
npx prisma migrate dev --name add_published_at
npx prisma generate
```

### 3. Add Toaster to Root Layout

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 4. Configure Next.js Images

If using external images, add domains to `next.config.js`:

```js
module.exports = {
  images: {
    domains: [
      "your-cdn.com",
      "images.unsplash.com", // if using Unsplash
    ],
  },
};
```

## 📝 Usage Examples

### Creating a New Post

1. Navigate to `/admin/blog`
2. Click "New Post" button
3. Fill in post details
4. Save as draft or publish immediately

### Managing Posts

```tsx
// The BlogList component handles all operations internally
<BlogList initialPosts={posts} />
```

### Viewing Public Posts

Public URL format: `/blogs/[slug]`
Example: `/blogs/best-properties-in-dubai-2024`

## 🔐 Authentication & Permissions

### Admin Routes Protection

```typescript
// Already implemented in page.tsx
const session = await getServerSession(authOptions);

if (!session) {
  redirect("/auth/login");
}

if (!["ADMIN", "EDITOR", "WRITER"].includes(session.user.role)) {
  redirect("/unauthorized");
}
```

### API Endpoints Protection

All API routes check for:

- Valid session
- Appropriate role (ADMIN, EDITOR, or WRITER)

## 🎯 API Endpoints

| Method | Endpoint                  | Description           | Auth Required      |
| ------ | ------------------------- | --------------------- | ------------------ |
| GET    | `/api/posts`              | List all posts        | Yes                |
| POST   | `/api/posts`              | Create new post       | Yes                |
| GET    | `/api/posts/[id]`         | Get single post       | No                 |
| PUT    | `/api/posts/[id]`         | Update post           | Yes (ADMIN)        |
| DELETE | `/api/posts/[id]`         | Delete post           | Yes (ADMIN)        |
| PATCH  | `/api/posts/[id]/publish` | Toggle publish status | Yes (ADMIN/EDITOR) |

## 🎨 Styling & Theming

### Custom Styles

The blog system uses Tailwind CSS and supports:

- Light/Dark mode via `next-themes`
- Responsive breakpoints (mobile-first)
- Custom color schemes from your theme

### Prose Styling

Blog content uses Typography plugin:

```css
/* Already applied in blog post page */
.prose {
  /* Automatic typography styling */
}
```

## 🔍 Search & Filter Logic

### Search Algorithm

```typescript
// Searches in title and excerpt
const matchesSearch =
  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
```

### Filter Combinations

All filters work together:

- Search + Category filter
- Search + Status filter
- Category + Status filter
- All three combined

## 📊 Performance Optimizations

1. **Server Components**: Data fetching on server
2. **Client Components**: Only interactive parts
3. **Image Optimization**: Next.js Image component
4. **Lazy Loading**: Images load as needed
5. **Pagination**: Reduces initial load time

## 🐛 Common Issues & Solutions

### Issue: Images Not Loading

**Solution**: Add image domains to `next.config.js`

```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### Issue: Toast Notifications Not Appearing

**Solution**: Ensure Toaster is in root layout

```tsx
import { Toaster } from "@/components/ui/sonner";
// Add <Toaster /> in layout
```

### Issue: Publish Toggle Not Working

**Solution**: Verify API endpoint exists at `/api/posts/[id]/publish/route.ts`

### Issue: Related Posts Not Showing

**Solution**: Ensure posts have matching categories

## 🚀 Future Enhancements

Potential additions for the blog system:

- [ ] **Comments System**: Add Disqus or custom comments
- [ ] **Analytics**: Track views and engagement
- [ ] **Social Sharing**: Share to Twitter, Facebook, LinkedIn
- [ ] **Email Subscriptions**: Newsletter integration
- [ ] **Rich Media**: Video embeds, galleries
- [ ] **Draft Auto-save**: Prevent content loss
- [ ] **Version History**: Track post changes
- [ ] **Bulk Operations**: Select multiple posts
- [ ] **Export/Import**: CSV or JSON export
- [ ] **SEO Score**: Content optimization tips

## 📱 Mobile Responsiveness

The blog system is fully responsive:

- **Desktop**: Full table view with all columns
- **Tablet**: Condensed layout with dropdown actions
- **Mobile**: Stacked cards with essential info

## ♿ Accessibility

Built with accessibility in mind:

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## 🎓 Developer Notes

### Extending the BlogList Component

```typescript
// Add custom filters
const [customFilter, setCustomFilter] = useState("");

// Add custom columns
<th className="text-left p-4">Your Column</th>

// Add custom actions
<DropdownMenuItem onClick={() => yourFunction(post.id)}>
  Your Action
</DropdownMenuItem>
```

### Customizing Public Blog Layout

Edit `/app/(frontend)/blogs/[slug]/page.tsx` to:

- Change typography
- Add custom sections
- Modify meta information display
- Customize related posts layout

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review the code comments
3. Check Prisma schema
4. Verify API endpoints are running

## ✅ Testing Checklist

Before deploying:

- [ ] Can create new posts
- [ ] Can edit existing posts
- [ ] Can delete posts with confirmation
- [ ] Search works correctly
- [ ] Filters work independently and combined
- [ ] Pagination navigates properly
- [ ] Publish toggle updates status
- [ ] Duplicate creates new post
- [ ] Public blog page displays content
- [ ] Related posts appear
- [ ] Images load correctly
- [ ] Dark mode works on all pages
- [ ] Mobile layout is responsive
- [ ] Toast notifications appear

## 📄 License

Part of Dubai Estate project. Internal use only.

---

**Built with ❤️ using Next.js, Prisma, and shadcn/ui**
