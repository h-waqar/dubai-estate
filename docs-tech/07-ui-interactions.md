# UI Interactions

## Component Library
Built on **shadcn/ui** (headless Radix UI + Tailwind).

## Key Components
- `Sidebar`/`Topbar`: Responsive dashboard navigation.
- `DataTable`: Used in Admin tables (sorting, pagination).
- `Forms`: `react-hook-form` + `zod` resolver.
    - Pattern: `<Form {...form}><form onSubmit={...}>...</form></Form>`

## Animations
- **Framer Motion**: Used for page transitions, modal entries, and interactive elements.

## Maps
- **Leaflet**: Used for Property/Project location display.
    - `MapContainer`, `TileLayer`, `Marker`.
