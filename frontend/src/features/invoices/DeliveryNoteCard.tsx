"use client";

import { CheckCircle2, Download, Loader2, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractErrorMessage } from "@/lib/api/client";
import { downloadDeliveryNotePdf } from "@/lib/api/deliveryNotes";
import type { Invoice } from "@/lib/api/types";
import { toast } from "@/store/toast-store";
import { useGenerateDeliveryNote, useMarkDeliveryNoteDelivered } from "./hooks";

export function DeliveryNoteCard({ invoice, canManage }: { invoice: Invoice; canManage: boolean }) {
  const [receivedByName, setReceivedByName] = useState("");
  const [downloading, setDownloading] = useState(false);

  const generate = useGenerateDeliveryNote();
  const markDelivered = useMarkDeliveryNoteDelivered(invoice.id);
  const note = invoice.delivery_note;

  const handleGenerate = async () => {
    try {
      await generate.mutateAsync(invoice.id);
      toast.success("Delivery note generated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadDeliveryNotePdf(invoice.id, note?.delivery_note_number);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setDownloading(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!note) return;
    try {
      await markDelivered.mutateAsync({ deliveryNoteId: note.id, receivedByName: receivedByName.trim() });
      toast.success("Delivery note marked as delivered.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 print:hidden">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-foreground-faint" />
        <h2 className="text-sm font-semibold">Delivery Note</h2>
      </div>

      {!note ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-foreground-muted">
            Generate a delivery note for this invoice — items and quantities only, no prices, with a signature line
            for whoever receives the goods.
          </p>
          <Button size="sm" className="shrink-0 gap-1.5" onClick={handleGenerate} disabled={generate.isPending}>
            {generate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
            Generate Delivery Note
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{note.delivery_note_number}</p>
              <p className="text-xs text-foreground-faint">
                {note.status === "delivered" ? (
                  <span className="inline-flex items-center gap-1 text-[var(--success)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Delivered {note.delivered_at ? new Date(note.delivered_at).toLocaleDateString() : ""}
                    {note.delivered_by_name ? ` by ${note.delivered_by_name}` : ""}
                    {note.received_by_name ? ` · Received by ${note.received_by_name}` : ""}
                  </span>
                ) : (
                  "Pending delivery"
                )}
              </p>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>

          {canManage && note.status === "pending" && (
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
              <Input
                placeholder="Received by (optional)"
                value={receivedByName}
                onChange={(e) => setReceivedByName(e.target.value)}
                className="h-8 max-w-xs text-sm"
              />
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                onClick={handleMarkDelivered}
                disabled={markDelivered.isPending}
              >
                {markDelivered.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Mark as Delivered
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
