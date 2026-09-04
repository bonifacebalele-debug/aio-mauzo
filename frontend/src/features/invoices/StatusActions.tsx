"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Invoice, InvoiceStatus } from "@/lib/api/types";
import { useUpdateInvoiceStatus } from "./hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

const NEXT_ACTIONS: Partial<Record<InvoiceStatus, { status: InvoiceStatus; label: string; variant: "primary" | "secondary" | "danger" }[]>> = {
  draft: [
    { status: "sent", label: "Mark as Sent", variant: "primary" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
  sent: [
    { status: "viewed", label: "Mark as Viewed", variant: "secondary" },
    { status: "paid", label: "Mark as Paid", variant: "primary" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
  viewed: [
    { status: "paid", label: "Mark as Paid", variant: "primary" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
  overdue: [
    { status: "paid", label: "Mark as Paid", variant: "primary" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
};

export function StatusActions({ invoice, canManage }: { invoice: Invoice; canManage: boolean }) {
  const updateStatus = useUpdateInvoiceStatus();

  if (!canManage) return null;

  const actions = NEXT_ACTIONS[invoice.status];
  if (!actions?.length) return null;

  const handleClick = async (status: InvoiceStatus) => {
    try {
      await updateStatus.mutateAsync({ id: invoice.id, status });
      toast.success(`Invoice marked as ${status}.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <>
      {actions.map((action) => (
        <Button
          key={action.status}
          variant={action.variant}
          size="sm"
          disabled={updateStatus.isPending}
          onClick={() => handleClick(action.status)}
        >
          {updateStatus.isPending && updateStatus.variables?.status === action.status ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          {action.label}
        </Button>
      ))}
    </>
  );
}
