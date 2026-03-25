// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Properties",
    links: [
      { name: "For Sale", href: "/for-sale" },
      { name: "For Rent", href: "/for-rent" },
      { name: "Off-Plan", href: "/off-plan" },
      { name: "All Properties", href: "/properties" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "List Property", href: "/advertise/property" },
      { name: "Off-Plan Projects", href: "/projects" },
      { name: "Investment Guides", href: "/blogs" },
      { name: "Market Reports", href: "/blogs" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/dubaiestateguide", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/dubaiestateguide1", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/dubai-estate-guide/", label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold">
                <span className="text-white">Dubai</span>
                <span className="text-yellow-500 dark:text-yellow-400">
                  Estate
                </span>
              </div>
            </Link>
            <p className="text-sm mb-6 text-gray-400 dark:text-gray-500">
              Your trusted guide to Dubai&apos;s real estate market. Expert
              insights, comprehensive guides, and premium property listings.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                <span>info@dubaiestate.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Dubai Marina, Dubai, UAE</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 dark:border-gray-900 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400 dark:text-gray-500">
            © {currentYear} Dubai Estate. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-yellow-500 dark:hover:bg-yellow-600 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
