// "use client";

// import { useState } from "react";
// import { Phone, Mail, Search, Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { ThemeToggle } from "../ui/theme-toggle";

// interface NavigationItem {
//   title: string;
//   href?: string;
//   items?: { name: string; href: string }[];
// }

// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { theme, setTheme } = useTheme();

//   const navigation: NavigationItem[] = [
//     {
//       title: "Property Listings",
//       items: [
//         { name: "Buy Properties", href: "/properties?type=buy" },
//         { name: "Rent Properties", href: "/properties?type=rent" },
//         { name: "Off-Plan Properties", href: "/properties?type=off-plan" },
//       ],
//     },
//     {
//       title: "Investment & Market Insights",
//       items: [
//         { name: "Market Analysis", href: "/market-insights" },
//         { name: "Investment Guides", href: "/investment-guides" },
//         { name: "ROI Calculator", href: "/roi-calculator" },
//       ],
//     },
//     {
//       title: "Neighborhood Guides",
//       items: [
//         { name: "Downtown Dubai", href: "/neighborhoods/downtown-dubai" },
//         { name: "Dubai Marina", href: "/neighborhoods/dubai-marina" },
//         { name: "Palm Jumeirah", href: "/neighborhoods/palm-jumeirah" },
//       ],
//     },
//     {
//       title: "Buying & Selling Tips",
//       items: [
//         { name: "Buyer's Guide", href: "/guides/buying" },
//         { name: "Seller's Guide", href: "/guides/selling" },
//         { name: "Legal Requirements", href: "/guides/legal" },
//       ],
//     },
//     {
//       title: "Luxury Real Estate",
//       href: "/luxury",
//     },
//     {
//       title: "News & Updates",
//       href: "/news",
//     },
//     {
//       title: "Expat & Lifestyle",
//       href: "/expat-lifestyle",
//     },
//   ];

//   return (
//     <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
//       {/* Top Bar */}
//       <div className="border-b border-border bg-muted/30">
//         <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
//           <div className="flex items-center gap-6 text-muted-foreground">
//             <a
//               href="tel:+971-4-123-4567"
//               className="flex items-center gap-2 hover:text-primary transition-colors"
//             >
//               <Phone className="h-4 w-4" />
//               <span className="hidden sm:inline">+971-4-123-4567</span>
//             </a>
//             <a
//               href="mailto:info@dubaiestateguide.com"
//               className="flex items-center gap-2 hover:text-primary transition-colors"
//             >
//               <Mail className="h-4 w-4" />
//               <span className="hidden md:inline">
//                 info@dubaiestateguide.com
//               </span>
//             </a>
//           </div>
//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//             <Button variant="ghost" size="sm" className="text-xs">
//               Sign In
//             </Button>
//             <Button
//               size="sm"
//               className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
//             >
//               List Property
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Header */}
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2 group">
//             <div className="flex items-center space-x-2">
//               <div className="bg-foreground text-background px-3 py-2 rounded font-bold text-xl">
//                 Dubai<span className="text-golden-accent">Estate</span>Guide
//               </div>
//               <span className="text-foreground text-xs">.com</span>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <NavigationMenu className="hidden lg:flex">
//             <NavigationMenuList>
//               {navigation.map((item) =>
//                 item.items ? (
//                   <NavigationMenuItem key={item.title}>
//                     <NavigationMenuTrigger className="text-sm font-medium">
//                       {item.title}
//                     </NavigationMenuTrigger>
//                     <NavigationMenuContent>
//                       <ul className="grid w-[400px] gap-3 p-4">
//                         {item.items.map((subItem) => (
//                           <li key={subItem.name}>
//                             <NavigationMenuLink asChild>
//                               <Link
//                                 href={subItem.href}
//                                 className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
//                               >
//                                 <div className="text-sm font-medium leading-none">
//                                   {subItem.name}
//                                 </div>
//                               </Link>
//                             </NavigationMenuLink>
//                           </li>
//                         ))}
//                       </ul>
//                     </NavigationMenuContent>
//                   </NavigationMenuItem>
//                 ) : (
//                   <NavigationMenuItem key={item.title}>
//                     <NavigationMenuLink asChild>
//                       <Link
//                         href={item.href || "#"}
//                         className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
//                       >
//                         {item.title}
//                       </Link>
//                     </NavigationMenuLink>
//                   </NavigationMenuItem>
//                 )
//               )}
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* Search & Mobile Menu */}
//           <div className="flex items-center gap-4">
//             {/* Search Button */}
//             <Button variant="ghost" size="icon" className="hidden md:flex">
//               <Search className="h-4 w-4" />
//             </Button>

//             {/* Mobile Menu Button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden border-t border-border bg-background">
//           <div className="container mx-auto px-4 py-4 space-y-4">
//             {navigation.map((item) => (
//               <div key={item.title} className="space-y-2">
//                 {item.items ? (
//                   <>
//                     <div className="font-semibold text-sm">{item.title}</div>
//                     <div className="ml-4 space-y-2">
//                       {item.items.map((subItem) => (
//                         <Link
//                           key={subItem.name}
//                           href={subItem.href}
//                           className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
//                           onClick={() => setMobileMenuOpen(false)}
//                         >
//                           {subItem.name}
//                         </Link>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   <Link
//                     href={item.href || "#"}
//                     className="block font-semibold text-sm hover:text-primary transition-colors py-1"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     {item.title}
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href?: string;
  items?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { title: "Home", href: "/" },
  {
    title: "Properties",
    items: [
      { name: "For Sale", href: "/properties/sale" },
      { name: "For Rent", href: "/properties/rent" },
      { name: "Off-Plan", href: "/properties/off-plan" },
      { name: "Luxury", href: "/properties/luxury" },
    ],
  },
  {
    title: "Areas",
    items: [
      { name: "Dubai Marina", href: "/areas/dubai-marina" },
      { name: "Downtown Dubai", href: "/areas/downtown" },
      { name: "Palm Jumeirah", href: "/areas/palm-jumeirah" },
      { name: "Business Bay", href: "/areas/business-bay" },
    ],
  },
  { title: "Blog", href: "/blog" },
  { title: "Guides", href: "/guides" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-gray-900 dark:text-white">Dubai</span>
              <span className="text-yellow-500 dark:text-yellow-400">
                Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.title} className="relative group">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-yellow-500 dark:text-yellow-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
                    }`}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-1 transition-colors"
                      onClick={() => toggleDropdown(item.title)}
                    >
                      {item.title}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                      <div className="rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2">
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Link href="/auth/login" className="hidden md:block">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/auth/register" className="hidden md:block me-0">
              <Button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                Get Started
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-white dark:bg-gray-900"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <div key={item.title}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2 rounded-md text-base font-medium ${
                            isActive(item.href)
                              ? "text-yellow-500 dark:text-yellow-400 bg-gray-100 dark:bg-gray-800"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.title)}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            {item.title}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                openDropdown === item.title ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openDropdown === item.title && (
                            <div className="ml-4 mt-2 space-y-2">
                              {item.items?.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 dark:border-gray-600"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
