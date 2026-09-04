import { FileBarChart } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import type { ReportResponse } from "@/lib/api/types";

export function ReportTable({ report, isLoading }: { report?: ReportResponse; isLoading: boolean }) {
  if (isLoading) {
    return <TableSkeleton rows={8} cols={5} />;
  }

  if (!report || report.data.length === 0) {
    return <EmptyState icon={FileBarChart} title="No data" description="Try a different date range." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
            {report.meta.headings.map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.data.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
              {Object.values(row).map((value, j) => (
                <td key={j} className="whitespace-nowrap px-4 py-2.5 tabular-nums">
                  {typeof value === "number" ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : (value ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
