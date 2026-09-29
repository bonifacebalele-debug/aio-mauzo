"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { ReportTable } from "@/features/reports/ReportTable";
import { useReport } from "@/features/reports/hooks";
import { downloadReportExport } from "@/lib/api/reports";
import { extractErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import type { ReportType } from "@/lib/api/types";

const REPORT_TABS: { key: ReportType; label: string; usesDateRange: boolean }[] = [
  { key: "sales", label: "Sales", usesDateRange: true },
  { key: "vat", label: "VAT", usesDateRange: true },
  { key: "customers", label: "Customers", usesDateRange: true },
  { key: "outstanding", label: "Outstanding", usesDateRange: false },
  { key: "payments", label: "Payments", usesDateRange: true },
];

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>("sales");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState<"csv" | "xlsx" | "pdf" | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const canExport = useAuthStore((s) => s.hasPermission("reports.export"));

  const activeTab = REPORT_TABS.find((t) => t.key === type)!;
  const filters = activeTab.usesDateRange ? { from: from || undefined, to: to || undefined } : {};
  const { data: report, isLoading } = useReport(type, filters);

  // The API returns the full matching row set for a report (it isn't paginated
  // server-side — export needs the whole range regardless of what's on screen),
  // so "per page" here just slices the already-fetched rows for display.
  const total = report?.data.length ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(page, lastPage);
  const pagedReport = useMemo(() => {
    if (!report) return report;
    const start = (currentPage - 1) * perPage;
    return { ...report, data: report.data.slice(start, start + perPage) };
  }, [report, currentPage, perPage]);

  const handleExport = async (format: "csv" | "xlsx" | "pdf") => {
    setDownloading(format);
    try {
      await downloadReportExport(type, format, filters);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div>
      <PageHeader title="Reports" description="Sales, VAT, customer, outstanding, and payment reports" />

      <div className="mb-4 inline-flex flex-wrap rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setType(tab.key);
              setPage(1);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              type === tab.key ? "bg-primary text-primary-foreground" : "text-foreground-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-3">
              {activeTab.usesDateRange && (
                <>
                  <div>
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      type="date"
                      value={from}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      type="date"
                      value={to}
                      onChange={(e) => {
                        setTo(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {canExport && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  loading={downloading === "csv"}
                  disabled={downloading !== null && downloading !== "csv"}
                  onClick={() => handleExport("csv")}
                >
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  loading={downloading === "xlsx"}
                  disabled={downloading !== null && downloading !== "xlsx"}
                  onClick={() => handleExport("xlsx")}
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  loading={downloading === "pdf"}
                  disabled={downloading !== null && downloading !== "pdf"}
                  onClick={() => handleExport("pdf")}
                >
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              </div>
            )}
          </div>

          <ReportTable report={pagedReport} isLoading={isLoading} />
        </CardContent>

        {!isLoading && total > 0 && (
          <Pagination
            meta={{ current_page: currentPage, last_page: lastPage, per_page: perPage, total }}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        )}
      </Card>
    </div>
  );
}
