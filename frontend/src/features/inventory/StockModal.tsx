"use client";

import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { extractErrorMessage } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";
import { formatRelativeTime } from "@/lib/utils/format";
import { toast } from "@/store/toast-store";
import { useAdjustStock, useProductMovements, useStockIn } from "./hooks";

interface StockModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const MOVEMENT_LABEL_COLOR: Record<string, string> = {
  stock_in: "text-[var(--success)]",
  sale: "text-[var(--danger)]",
  adjustment: "text-foreground-muted",
};

export function StockModal({ open, onClose, product }: StockModalProps) {
  const [mode, setMode] = useState<"in" | "adjust">("in");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const stockIn = useStockIn(product?.id ?? 0);
  const adjustStock = useAdjustStock(product?.id ?? 0);
  const { data: movements } = useProductMovements(product?.id, 1);

  const resetForm = () => {
    setQuantity("");
    setUnitCost("");
    setSupplierName("");
    setNotes("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    setMode("in");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const qty = Number(quantity);
    if (!qty || (mode === "in" && qty <= 0)) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    if (mode === "adjust" && !notes.trim()) {
      setError("A short note is required for manual adjustments.");
      return;
    }

    try {
      if (mode === "in") {
        await stockIn.mutateAsync({
          quantity: qty,
          unit_cost: unitCost ? Number(unitCost) : null,
          supplier_name: supplierName || null,
          notes: notes || null,
        });
        toast.success(`Received ${qty} x ${product.name}.`);
      } else {
        await adjustStock.mutateAsync({ quantity: qty, notes });
        toast.success(`Stock adjusted by ${qty > 0 ? "+" : ""}${qty}.`);
      }
      resetForm();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (!product) return null;

  const isSubmitting = stockIn.isPending || adjustStock.isPending;

  return (
    <Modal open={open} onClose={handleClose} title={`Stock — ${product.name}`} maxWidth="max-w-xl">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--neutral-bg)] px-4 py-3">
          <span className="text-sm text-foreground-muted">On hand</span>
          <span className="text-lg font-bold tabular-nums">
            {product.quantity_on_hand} {product.unit}
          </span>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("in");
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors ${
              mode === "in"
                ? "border-primary bg-primary/10 text-primary"
                : "border-[var(--border)] text-foreground-muted"
            }`}
          >
            <ArrowUpCircle className="h-4 w-4" /> Stock In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("adjust");
              setError(null);
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors ${
              mode === "adjust"
                ? "border-primary bg-primary/10 text-primary"
                : "border-[var(--border)] text-foreground-muted"
            }`}
          >
            <ArrowDownCircle className="h-4 w-4" /> Adjust
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="quantity">{mode === "in" ? "Quantity received" : "Quantity change (+ or −)"}</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              placeholder={mode === "in" ? "e.g. 10" : "e.g. -2"}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {mode === "in" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="unit_cost">Unit Cost</Label>
                <Input
                  id="unit_cost"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="Optional"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="supplier_name">Supplier</Label>
                <Input
                  id="supplier_name"
                  placeholder="Optional"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="stock_notes">{mode === "adjust" ? "Reason" : "Notes"}</Label>
            <Textarea
              id="stock_notes"
              rows={2}
              placeholder={mode === "adjust" ? "e.g. Damaged unit found during count" : "Optional"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <FieldError>{error ?? undefined}</FieldError>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "in" ? "Record stock in" : "Save adjustment"}
          </Button>
        </form>

        {!!movements?.data.length && (
          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-faint">
              Recent movements
            </p>
            <ul className="space-y-2 text-sm">
              {movements.data.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <div>
                    <span className={`font-medium ${MOVEMENT_LABEL_COLOR[m.type]}`}>
                      {m.quantity > 0 ? "+" : ""}
                      {m.quantity}
                    </span>{" "}
                    <span className="text-foreground-muted">{m.type_label.toLowerCase()}</span>
                    {m.supplier_name && <span className="text-foreground-faint"> — {m.supplier_name}</span>}
                    {m.notes && <span className="text-foreground-faint"> — {m.notes}</span>}
                  </div>
                  <span className="shrink-0 text-xs text-foreground-faint">{formatRelativeTime(m.created_at)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
