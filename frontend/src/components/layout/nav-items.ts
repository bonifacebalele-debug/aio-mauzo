import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Settings,
  UserCircle,
  UserCog,
  Users,
  type LucideIcon,
  FileText,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  { label: "Invoices", href: "/invoices", icon: FileText, permission: "invoices.view" },
  { label: "Reports", href: "/reports", icon: BarChart3, permission: "reports.view" },
  { label: "Activity", href: "/activity", icon: Activity, permission: "users.view" },
  { label: "Users", href: "/users", icon: UserCog, permission: "users.view" },
  { label: "Settings", href: "/settings/company", icon: Settings, permission: "settings.view" },
  { label: "My Profile", href: "/profile", icon: UserCircle },
];
