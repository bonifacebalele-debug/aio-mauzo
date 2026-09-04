"use client";

import { LogOut, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.replace("/login");
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
          <Receipt className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">AIO Invoice</p>
          <p className="text-xs text-foreground-faint leading-tight">AIO Technologies</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission)).map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground-muted hover:bg-[var(--neutral-bg)] hover:text-foreground",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--neutral-bg)] text-sm font-semibold text-foreground-muted">
            {user?.name?.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-foreground-faint">{user?.roles?.[0]}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
