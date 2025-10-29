// import Link from 'next/link';

// export default function Footer() {
//   return (
//     <footer className="navigation-bg text-white">
//       <div className="container mx-auto px-4 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
//           {/* Company Info */}
//           <div className="lg:col-span-1">
//             <h3 className="text-xl font-bold mb-4">
//               DubaiEstateGuide<span className="text-sm">.com</span>
//             </h3>
//             <p className="text-gray-300 mb-6 text-sm">
//               Your trusted source for Dubai real estate insights, market analysis, and investment opportunities.
//             </p>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center">
//                 <MailIcon className="w-4 h-4 mr-2" />
//                 <span>info@dubaiestateguide.com</span>
//               </div>
//               <div className="flex items-center">
//                 <MapPinIcon className="w-4 h-4 mr-2" />
//                 <span>Dubai, United Arab Emirates</span>
//               </div>
//             </div>
//           </div>

//           {/* Property Types */}
//           <div>
//             <h4 className="font-semibold mb-4">Property Types</h4>
//             <ul className="space-y-2 text-sm text-gray-300">
//               {['Apartments', 'Villas', 'Penthouses', 'Commercial', 'Off-Plan Properties', 'Luxury Estates'].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Dubai Areas */}
//           <div>
//             <h4 className="font-semibold mb-4">Dubai Areas</h4>
//             <ul className="space-y-2 text-sm text-gray-300">
//               {['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Jumeirah Beach Residence', 'Business Bay', 'Dubai Hills'].map((area) => (
//                 <li key={area}>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     {area}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Resources */}
//           <div>
//             <h4 className="font-semibold mb-4">Resources</h4>
//             <ul className="space-y-2 text-sm text-gray-300">
//               {['Market Reports', 'Property Calculator', 'Investment Guide', 'Legal Advice', 'Mortgage Services', 'Area Guides'].map((resource) => (
//                 <li key={resource}>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     {resource}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Company */}
//           <div>
//             <h4 className="font-semibold mb-4">Company</h4>
//             <ul className="space-y-2 text-sm text-gray-300">
//               {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Advertise With Us', 'Careers'].map((item) => (
//                 <li key={item}>
//                   <Link href="#" className="hover:text-white transition-colors">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-white/20 mt-12 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex space-x-4 mb-4 md:mb-0">
//               <SocialLink href="#" icon={<FacebookIcon />} />
//               <SocialLink href="#" icon={<TwitterIcon />} />
//               <SocialLink href="#" icon={<InstagramIcon />} />
//               <SocialLink href="#" icon={<LinkedInIcon />} />
//             </div>
//             <div className="text-sm text-gray-300">
//               © 2025 DubaiEstateGuide.com. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// // Social Link Component
// function SocialLink({ href, icon }) {
//   return (
//     <Link href={href} className="text-gray-300 hover:text-white transition-colors">
//       {icon}
//     </Link>
//   );
// }

// // Social Icons
// function FacebookIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
//     </svg>
//   );
// }

// function TwitterIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
//     </svg>
//   );
// }

// function InstagramIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
//       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
//       <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
//     </svg>
//   );
// }

// function LinkedInIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
//       <rect width="4" height="12" x="2" y="9"></rect>
//       <circle cx="4" cy="4" r="2"></circle>
//     </svg>
//   );
// }

// function MailIcon({ className = "w-4 h-4" }) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//       <rect width="20" height="16" x="2" y="4" rx="2"></rect>
//       <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
//     </svg>
//   );
// }

// function MapPinIcon({ className = "w-4 h-4" }) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//       <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
//       <circle cx="12" cy="10" r="3"></circle>
//     </svg>
//   );
// }

// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
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
      { name: "For Sale", href: "/properties/sale" },
      { name: "For Rent", href: "/properties/rent" },
      { name: "Off-Plan", href: "/properties/off-plan" },
      { name: "Luxury Properties", href: "/properties/luxury" },
    ],
  },
  {
    title: "Areas",
    links: [
      { name: "Dubai Marina", href: "/areas/dubai-marina" },
      { name: "Downtown Dubai", href: "/areas/downtown" },
      { name: "Palm Jumeirah", href: "/areas/palm-jumeirah" },
      { name: "Business Bay", href: "/areas/business-bay" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "Market Insights", href: "/insights" },
      { name: "Investment Tips", href: "/investment" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Partners", href: "/partners" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
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
