"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tags,
  Star,
  ChevronDown,
  Image as ImageIcon,
  CheckCircle,
  Building,
  Home,
  Briefcase,
  Construction,
  Key,
  FolderTree,
  ClipboardCheck,
  BadgeCheck,
  ShieldCheck,
  PenTool,
  Hash,
  Library,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// --- Types ---
export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  subItems?: SidebarItem[];
};

// --- Data ---
export const adminLinks: SidebarItem[] = [
  {
    label: "System",
    icon: Settings,
    subItems: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "User Management",
    icon: Users,
    subItems: [
      { href: "/admin/users", label: "Users", icon: User },
      { href: "/admin/admins", label: "Admins", icon: ShieldCheck },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    subItems: [
      { href: "/admin/revenue", label: "Revenue", icon: TrendingUp },
      { href: "/admin/pricing", label: "Pricing Plans", icon: ShoppingBag },
      { href: "/admin/subscribers", label: "Subscribers", icon: Users },
    ],
  },
  {
    label: "Content",
    icon: Library,
    subItems: [
      { href: "/admin/products", label: "Products", icon: ShoppingBag },
      { href: "/admin/blog", label: "Blog Posts", icon: PenTool },
      { href: "/admin/categories", label: "Blog Categories", icon: Hash },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    label: "Property",
    icon: Home,
    subItems: [
      { href: "/admin/approvals", label: "Approvals", icon: BadgeCheck },
      { href: "/admin/properties", label: "All Properties", icon: Building },
      { href: "/admin/property-types", label: "Property Types", icon: Key },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/features", label: "Features", icon: Star },
      { href: "/admin/developers", label: "Developers", icon: Construction },
    ],
  },
  {
    label: "Projects",
    icon: FolderTree,
    subItems: [
      { href: "/admin/project-approvals", label: "Approvals", icon: ClipboardCheck },
      { href: "/admin/projects", label: "All Projects", icon: Briefcase },
    ],
  },
];

// --- Components ---

interface SidebarItemProps {
  item: SidebarItem;
  isCollapsed: boolean;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: (label: string) => void;
  onLinkClick?: () => void;
}

function SidebarItemRender({
  item,
  isCollapsed,
  isActive,
  isExpanded,
  onToggleExpand,
  onLinkClick,
}: SidebarItemProps) {
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const pathname = usePathname();

  // Check if any child is active to highlight parent
  const isChildActive =
    hasSubItems &&
    item.subItems?.some((sub) => sub.href && pathname === sub.href);

  // If collapsed, we handle things differently (hover menus)
  // If expanded, we use standard accordion

  if (isCollapsed) {
    return (
      <div className="group relative">
        <div
          className={cn(
            "flex items-center justify-center p-3 rounded-lg transition-all duration-200 cursor-pointer",
            "hover:bg-primary/10",
            (isActive || isChildActive) && "bg-primary/15 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Hover Menu for Collapsed State */}
        <div className="absolute left-full top-0 ml-2 w-48 bg-card border rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 p-2">
          <div className="font-semibold px-3 py-2 border-b mb-2 text-sm text-foreground/80">
            {item.label}
          </div>
          {hasSubItems ? (
            <div className="flex flex-col space-y-1">
              {item.subItems?.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href || "#"}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-primary/10 transition-colors",
                    pathname === sub.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <sub.icon className="h-4 w-4" />
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          ) : (
            item.href && (
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "block px-3 py-2 text-sm rounded-md hover:bg-primary/10 transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  Go to {item.label}
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    );
  }

  // Expanded Sidebar Mode
  return (
    <div className="mb-1">
      {hasSubItems ? (
        <>
          <button
            onClick={() => onToggleExpand(item.label)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-primary/10",
              (isActive || isChildActive) && "text-primary font-medium"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3 opacity-50" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-6 pt-1 pb-1 space-y-1">
                  {item.subItems?.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href || "#"}
                      onClick={onLinkClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        "hover:bg-primary/10",
                        pathname === sub.href
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <sub.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href || "#"}
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-primary/10",
            isActive
              ? "bg-primary/15 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
          <span className="truncate">{item.label}</span>
        </Link>
      )}
    </div>
  );
}

interface SidebarLinksProps {
  isCollapsed: boolean;
  links: SidebarItem[];
  onLinkClick?: () => void;
}

function SidebarLinks({ isCollapsed, links, onLinkClick }: SidebarLinksProps) {
  const pathname = usePathname();
  // State to track which categories are expanded
  // Initialize with the category containing the current route
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Effect to auto-expand the category containing the current page on mount/navigation
  useEffect(() => {
    links.forEach(group => {
      if (group.subItems?.some(item => item.href === pathname)) {
        setExpandedItems(prev => {
          if (!prev.includes(group.label)) return [...prev, group.label];
          return prev;
        });
      }
    });
  }, [pathname, links]);


  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <nav className="flex-1 space-y-1">
      {links.map((link) => (
        <SidebarItemRender
          key={link.label}
          item={link}
          isCollapsed={isCollapsed}
          isActive={pathname === link.href}
          isExpanded={expandedItems.includes(link.label)}
          onToggleExpand={toggleExpand}
          onLinkClick={onLinkClick}
        />
      ))}
    </nav>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  links?: SidebarItem[];
  title?: string;
}

export function Sidebar({ isCollapsed, onToggleCollapse, links = adminLinks, title = "Admin Dashboard" }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r bg-card transition-all duration-300 ease-in-out sticky top-0 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b min-h-16">
        {!isCollapsed && (
          <div className="text-lg font-bold truncate">{title}</div>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "p-1.5 rounded-lg hover:bg-primary/10 transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-1 p-3 overflow-y-auto overflow-x-hidden">
        <SidebarLinks isCollapsed={isCollapsed} links={links} />
      </div>
    </aside>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links?: SidebarItem[];
  title?: string;
}

export function MobileSidebar({ open, onOpenChange, links = adminLinks, title = "Admin Dashboard" }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">{title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100%-4rem)] p-3 overflow-y-auto">
          <SidebarLinks
            isCollapsed={false}
            links={links}
            onLinkClick={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
