import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "danger" | "info";
  loading?: boolean;
}

const accentClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-[var(--success-bg)] text-[var(--success)]",
  warning: "bg-[var(--warning-bg)] text-[var(--warning)]",
  danger: "bg-[var(--danger-bg)] text-[var(--danger)]",
  info: "bg-[var(--info-bg)] text-[var(--info)]",
};

export function StatCard({ label, value, icon: Icon, accent = "primary", loading }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">{label}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]", accentClasses[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-24" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
    </Card>
  );
}
