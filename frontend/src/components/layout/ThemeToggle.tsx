"use client";

import { Moon, Sun } from "lucide-react";
import { useUiStore } from "@/store/ui-store";

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-foreground-muted transition-colors hover:bg-[var(--neutral-bg)] hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}
