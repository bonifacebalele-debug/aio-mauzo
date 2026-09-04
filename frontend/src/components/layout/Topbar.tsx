"use client";

import { Receipt } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-lg px-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
          <Receipt className="h-4.5 w-4.5" />
        </div>
        <p className="text-sm font-semibold">AIO Invoice</p>
      </div>
      <ThemeToggle />
    </header>
  );
}
