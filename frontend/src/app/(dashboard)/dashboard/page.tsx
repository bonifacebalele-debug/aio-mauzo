"use client";

import { AlertTriangle, Banknote, FileText, TrendingUp, Users, Wallet } from "lucide-react";
import { useState } from "react";
import { ChartCard } from "@/features/dashboard/ChartCard";
import { DateRangeFilter } from "@/features/dashboard/DateRangeFilter";
import { LatestCustomersCard, LatestPaymentsCard, RecentActivityCard, TopCustomersCard } from "@/features/dashboard/SideLists";
import { StatCard } from "@/features/dashboard/StatCard";
import { useDashboardStats, useMonthlyIncome, useMonthlyInvoices } from "@/features/dashboard/hooks";
import { PageHeader } from "@/components/layout/PageHeader";
import type { DashboardFilters } from "@/lib/api/dashboard";
import { formatMoney } from "@/lib/utils/format";

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const isFiltered = Boolean(filters.from || filters.to);

  const { data: stats, isLoading: statsLoading } = useDashboardStats(filters);
  const { data: income, isLoading: incomeLoading } = useMonthlyIncome(filters);
  const { data: invoiceCounts, isLoading: invoiceCountsLoading } = useMonthlyInvoices(filters);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of sales, invoices, and customer activity" />

      <div className="mb-6 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <DateRangeFilter value={filters} onChange={setFilters} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label={isFiltered ? "Period Sales" : "Today's Sales"}
          value={formatMoney(stats?.todays_sales ?? 0)}
          icon={TrendingUp}
          accent="primary"
          loading={statsLoading}
        />
        <StatCard
          label="Revenue"
          value={formatMoney(stats?.revenue ?? 0)}
          icon={Banknote}
          accent="success"
          loading={statsLoading}
        />
        <StatCard
          label="Outstanding"
          value={formatMoney(stats?.outstanding_balance ?? 0)}
          icon={Wallet}
          accent="warning"
          loading={statsLoading}
        />
        <StatCard
          label="Invoices"
          value={String(stats?.invoices.total ?? 0)}
          icon={FileText}
          accent="info"
          loading={statsLoading}
        />
        <StatCard
          label="Overdue"
          value={String(stats?.invoices.overdue ?? 0)}
          icon={AlertTriangle}
          accent="danger"
          loading={statsLoading}
        />
        <StatCard
          label="Customers"
          value={String(stats?.customers_count ?? 0)}
          icon={Users}
          accent="primary"
          loading={statsLoading}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {[
          { label: "Draft", value: stats?.invoices.draft, tone: "text-foreground-muted" },
          { label: "Sent", value: stats?.invoices.sent, tone: "text-[var(--info)]" },
          { label: "Viewed", value: stats?.invoices.viewed, tone: "text-[var(--info)]" },
          { label: "Paid", value: stats?.invoices.paid, tone: "text-[var(--success)]" },
          { label: "Pending", value: stats?.invoices.pending, tone: "text-[var(--warning)]" },
          { label: "Cancelled", value: stats?.invoices.cancelled, tone: "text-[var(--danger)]" },
        ].map((item) => (
          <div key={item.label} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <p className="text-xs text-foreground-faint">{item.label}</p>
            <p className={`mt-0.5 text-lg font-semibold tabular-nums ${item.tone}`}>{item.value ?? "—"}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Monthly Income"
          data={income}
          isLoading={incomeLoading}
          type="area"
          valueFormatter={(v) => formatMoney(v)}
        />
        <ChartCard title="Monthly Invoices" data={invoiceCounts} isLoading={invoiceCountsLoading} type="bar" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <LatestCustomersCard filters={filters} />
        <LatestPaymentsCard filters={filters} />
        <TopCustomersCard filters={filters} />
        <RecentActivityCard filters={filters} />
      </div>
    </div>
  );
}
