"use client";

import { Activity, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useActivityLogs } from "@/features/activity/hooks";
import { formatDateTime } from "@/lib/utils/format";

export default function ActivityLogPage() {
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useActivityLogs({ action: action || undefined, page, per_page: 25 });

  return (
    <div>
      <PageHeader title="Activity Log" description="Audit trail of actions taken across the system" />

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
        <Input
          placeholder="Filter by action (e.g. invoice, customer)…"
          className="pl-9"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={8} cols={4} />
        ) : !data?.data.length ? (
          <EmptyState icon={Activity} title="No activity found" />
        ) : (
          <>
            <ul className="divide-y divide-[var(--border)]">
              {data.data.map((log) => (
                <li key={log.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{log.description ?? log.action}</p>
                    <p className="text-xs text-foreground-faint">
                      {log.user_name} · {formatDateTime(log.created_at)}
                      {log.ip_address ? ` · ${log.ip_address}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
