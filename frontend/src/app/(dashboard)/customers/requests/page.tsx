"use client";

import { Check, Inbox, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/StatusPill";
import { useApproveCustomerIntake, useCustomerIntakes, useRejectCustomerIntake } from "@/features/customers/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { CustomerIntake, CustomerIntakeStatus } from "@/lib/api/types";
import { formatDateTime } from "@/lib/utils/format";
import { toast } from "@/store/toast-store";

const TABS: { label: string; value: CustomerIntakeStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function CustomerRequestsPage() {
  const [status, setStatus] = useState<CustomerIntakeStatus>("pending");
  const [pendingReject, setPendingReject] = useState<CustomerIntake | null>(null);

  const { data, isLoading } = useCustomerIntakes({ status, per_page: 20 });
  const approve = useApproveCustomerIntake();
  const reject = useRejectCustomerIntake();

  const handleApprove = async (intake: CustomerIntake) => {
    try {
      await approve.mutateAsync(intake.id);
      toast.success(`${intake.company_name} added to your customers.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleReject = async () => {
    if (!pendingReject) return;
    try {
      await reject.mutateAsync({ id: pendingReject.id });
      toast.success(`Request from ${pendingReject.company_name} rejected.`);
      setPendingReject(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Customer Requests"
        description="Details customers sent you directly — review and approve to add them as customers"
      />

      <div className="mb-4 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-primary/10 text-primary"
                : "text-foreground-muted hover:bg-[var(--neutral-bg)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <EmptyState
            icon={Inbox}
            title="No requests here"
            description="Details customers send through your shared link/QR code will show up here."
          />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {data.data.map((intake) => (
              <div key={intake.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{intake.company_name}</p>
                  <p className="truncate text-xs text-foreground-faint">
                    {[intake.contact_person, intake.phone, intake.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground-faint">{formatDateTime(intake.created_at)}</p>
                </div>

                {status === "pending" ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPendingReject(intake)}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                    <Button size="sm" loading={approve.isPending} onClick={() => handleApprove(intake)}>
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                ) : (
                  <Badge
                    className={
                      status === "approved"
                        ? "bg-[var(--success-bg)] text-[var(--success)]"
                        : "bg-[var(--danger-bg)] text-[var(--danger)]"
                    }
                  >
                    {status === "approved" ? "Approved" : "Rejected"}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingReject !== null}
        title="Reject request"
        description={`This will reject the request from "${pendingReject?.company_name}". They can still resubmit later.`}
        loading={reject.isPending}
        onConfirm={handleReject}
        onCancel={() => setPendingReject(null)}
      />
    </div>
  );
}
