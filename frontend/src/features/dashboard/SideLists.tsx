"use client";

import { Activity, Trophy, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DashboardFilters } from "@/lib/api/dashboard";
import { formatDateTime } from "@/lib/utils/format";
import { useLatestCustomers, useLatestPayments, useRecentActivity, useTopCustomers } from "./hooks";

interface DashboardCardProps {
  filters?: DashboardFilters;
}

export function LatestCustomersCard({ filters }: DashboardCardProps) {
  const { data, isLoading } = useLatestCustomers(filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : !data?.length ? (
          <EmptyState icon={Users} title="No customers yet" />
        ) : (
          data.map((c) => (
            <Link
              key={c.id}
              href={`/customers/${c.id}/edit`}
              className="flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 -mx-2 transition-colors hover:bg-[var(--neutral-bg)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.company_name}</p>
                <p className="truncate text-xs text-foreground-faint">{c.city ?? c.country ?? "—"}</p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function LatestPaymentsCard({ filters }: DashboardCardProps) {
  const { data, isLoading } = useLatestPayments(filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : !data?.length ? (
          <EmptyState icon={Wallet} title="No payments recorded yet" />
        ) : (
          data.map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.customer_name ?? "—"}</p>
                <p className="truncate text-xs text-foreground-faint">{p.invoice_number}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--success)]">
                +{p.amount.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function TopCustomersCard({ filters }: DashboardCardProps) {
  const { data, isLoading } = useTopCustomers(filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : !data?.length ? (
          <EmptyState icon={Trophy} title="Not enough data yet" />
        ) : (
          data.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-bg)] text-xs font-semibold text-foreground-muted">
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{c.company_name}</p>
              <p className="shrink-0 text-sm font-semibold tabular-nums">{c.total_invoiced.toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function RecentActivityCard({ filters }: DashboardCardProps) {
  const { data, isLoading } = useRecentActivity(filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
        ) : !data?.length ? (
          <EmptyState icon={Activity} title="No activity yet" />
        ) : (
          data.map((a) => (
            <div key={a.id} className="flex gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{a.description ?? a.action}</p>
                <p className="text-xs text-foreground-faint">
                  {a.user_name ?? "System"} · {formatDateTime(a.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
