import {
  Activity,
  BarChart3,
  Boxes,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  Receipt,
  Settings,
  UserCircle,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  badge?: "pendingIntakes" | "lowStock";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Customers", href: "/customers", icon: Users, permission: "customers.view" },
  {
    label: "Customer Requests",
    href: "/customers/requests",
    icon: Inbox,
    permission: "customers.create",
    badge: "pendingIntakes",
  },
  { label: "Invoices", href: "/invoices", icon: FileText, permission: "invoices.view" },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    permission: "inventory.view",
    badge: "lowStock",
  },
  { label: "Expenses", href: "/expenses", icon: Receipt, permission: "expenses.view" },
  { label: "Reports", href: "/reports", icon: BarChart3, permission: "reports.view" },
  { label: "Activity", href: "/activity", icon: Activity, permission: "users.view" },
  { label: "Users", href: "/users", icon: UserCog, permission: "users.view" },
  { label: "Settings", href: "/settings/company", icon: Settings, permission: "settings.view" },
  { label: "My Profile", href: "/profile", icon: UserCircle },
];
