"use client";

import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-lg px-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size brand mark, next/image is overkill */}
        <img src="/logo.png" alt="AIO Invoice" className="h-8 w-8 shrink-0 object-contain" />
        <p className="text-sm font-semibold">AIO Invoice</p>
      </div>
      <div className="flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
