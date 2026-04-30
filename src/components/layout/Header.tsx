// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/modules/user/hooks/useAuth";
import { UserProfileDropdown } from "@/components/common/UserProfileDropdown";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href?: string;
  items?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  // { title: "Home", href: "/" },
  {
    title: "Properties",
    items: [
      { name: "For Sale", href: "/for-sale" },
      { name: "For Rent", href: "/for-rent" },
      { name: "Off-Plan", href: "/off-plan" },
      // { name: "Luxury", href: "/properties" },
    ],
  },
  { title: "Projects", href: "/projects" },
  {
    title: "Add Listing",
    items: [
      { name: "Property", href: "/advertise/property" },
      { name: "Project", href: "/advertise/projects" },
    ],
  },

  // {
  //   title: "Areas",
  //   items: [
  //     { name: "Dubai Marina", href: "/areas/dubai-marina" },
  //     { name: "Downtown Dubai", href: "/areas/downtown" },
  //     { name: "Palm Jumeirah", href: "/areas/palm-jumeirah" },
  //     { name: "Business Bay", href: "/areas/business-bay" },
  //   ],
  // },
  { title: "Pricing", href: "/pricing" },
  { title: "Blog", href: "/blogs" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isAuthenticated, userRoles } = useAuth();

  const isAdmin =
    userRoles?.includes("ADMIN") || userRoles?.includes("SUPER_ADMIN");

  const isActive = (href: string) => pathname === href;

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/icons/logo.svg"
              alt="Dubai Estate Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
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
                      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-1 transition-colors cursor-pointer"
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

            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/register" className="hidden md:block me-0">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

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
                    {isAuthenticated ? (
                      <>
                        <Link href="/account" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 dark:text-gray-300"
                          >
                            <UserIcon className="mr-2 h-4 w-4" />
                            My Account
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-gray-700 dark:text-gray-300"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 dark:border-gray-600"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white">
                            Get Started
                          </Button>
                        </Link>
                      </>
                    )}
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
