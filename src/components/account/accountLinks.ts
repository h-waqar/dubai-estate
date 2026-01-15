
import {
  LayoutDashboard,
  User,
  Shield,
  CreditCard,
  History,
  Building,
  Briefcase,
} from "lucide-react";
import { SidebarItem } from "@/components/dashboard/Sidebar";

export const accountLinks: SidebarItem[] = [
  {
    label: "Account",
    icon: User,
    subItems: [
      { href: "/account/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/account", label: "Profile", icon: User },
      { href: "/account?tab=security", label: "Security", icon: Shield },
    ],
  },
  {
    label: "Billing",
    icon: CreditCard,
    subItems: [
      { href: "/account/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/account/subscriptions/history", label: "Payment History", icon: History },
    ],
  },
  {
    label: "My Content",
    icon: Building,
    roles: ["AGENT", "ADMIN"],
    subItems: [
      { href: "/account/properties", label: "My Properties", icon: Building },
      { href: "/account/projects", label: "My Projects", icon: Briefcase },
    ],
  },
];
