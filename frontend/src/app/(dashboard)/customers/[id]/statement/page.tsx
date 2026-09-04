"use client";

import { Download, Loader2, Receipt } from "lucide-react";
import { use, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Label } from "@/components/ui/Input";
import { useCustomer, useCustomerStatement } from "@/features/customers/hooks";
import { getStatementPdfUrl } from "@/lib/api/customers";
import { formatDate, formatMoney } from "@/lib/utils/format";

export default function CustomerStatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const customerId = Number(id);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: customer } = useCustomer(customerId);
  const filters = { from: from || undefined, to: to || undefined };
  const { data: statement, isLoading } = useCustomerStatement(customerId, filters);

  return (
    <div>
      <PageHeader
        title="Customer Statement"
        description={customer?.company_name}
        actions={
          <a
            href={getStatementPdfUrl(customerId, filters)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm", className: "gap-1.5" })}
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="from">From</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="to">To</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
        </div>
      ) : !statement?.entries.length ? (
        <Card>
          <EmptyState icon={Receipt} title="No activity" description="No invoices or payments in this period." />
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Debit</th>
                    <th className="px-4 py-3 font-medium text-right">Credit</th>
                    <th className="px-4 py-3 font-medium text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.entries.map((entry, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-2.5">{formatDate(entry.date)}</td>
                      <td className="px-4 py-2.5">{entry.description}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {entry.debit > 0 ? formatMoney(entry.debit) : ""}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--success)]">
                        {entry.credit > 0 ? formatMoney(entry.credit) : ""}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium tabular-nums">{formatMoney(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-end">
            <Card className="w-full max-w-xs">
              <CardContent className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Total Invoiced</span>
                  <span className="font-medium tabular-nums">{formatMoney(statement.summary.total_invoiced)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Total Paid</span>
                  <span className="font-medium tabular-nums">{formatMoney(statement.summary.total_paid)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-1.5 text-base font-bold">
                  <span>Closing Balance</span>
                  <span className="text-primary">{formatMoney(statement.summary.closing_balance)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
