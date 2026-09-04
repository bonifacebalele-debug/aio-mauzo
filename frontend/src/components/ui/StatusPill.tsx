import type { ReactNode } from "react";
import type { InvoiceStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<InvoiceStatus, string> = {
  draft: "bg-[var(--neutral-bg)] text-foreground-muted",
  sent: "bg-[var(--info-bg)] text-[var(--info)]",
  viewed: "bg-[var(--info-bg)] text-[var(--info)]",
  paid: "bg-[var(--success-bg)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-bg)] text-[var(--danger)]",
  overdue: "bg-[var(--warning-bg)] text-[var(--warning)]",
};

export function StatusPill({ status, label }: { status: InvoiceStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--neutral-bg)] px-2.5 py-1 text-xs font-medium text-foreground-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
