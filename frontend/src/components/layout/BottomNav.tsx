"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePendingIntakeCount } from "@/features/customers/hooks";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { NAV_ITEMS } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const items = NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission));
  const { data: pendingCount } = usePendingIntakeCount();

  // Pick the single longest-matching href so a nested route (e.g.
  // /customers/requests) doesn't also light up its parent (/customers).
  const activeHref = [...items]
    .filter((item) => pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-lg lg:hidden pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const active = item.href === activeHref;
        const showDot = item.badge === "pendingIntakes" && !!pendingCount;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-foreground-faint",
            )}
          >
            <span className="relative">
              <item.icon className="h-5 w-5" />
              {showDot && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--danger)]" />}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
