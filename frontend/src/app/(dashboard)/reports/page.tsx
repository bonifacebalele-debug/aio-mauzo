"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { ReportTable } from "@/features/reports/ReportTable";
import { useReport } from "@/features/reports/hooks";
import { getReportExportUrl } from "@/lib/api/reports";
import { cn } from "@/lib/utils/cn";
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

  const activeTab = REPORT_TABS.find((t) => t.key === type)!;
  const filters = activeTab.usesDateRange ? { from: from || undefined, to: to || undefined } : {};
  const { data: report, isLoading } = useReport(type, filters);

  return (
    <div>
      <PageHeader title="Reports" description="Sales, VAT, customer, outstanding, and payment reports" />

      <div className="mb-4 inline-flex flex-wrap rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setType(tab.key)}
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
                    <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={getReportExportUrl(type, "csv", filters)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <Download className="h-4 w-4" /> CSV
              </a>
              <a
                href={getReportExportUrl(type, "xlsx", filters)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </a>
              <a
                href={getReportExportUrl(type, "pdf", filters)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
              >
                <FileText className="h-4 w-4" /> PDF
              </a>
            </div>
          </div>

          <ReportTable report={report} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
