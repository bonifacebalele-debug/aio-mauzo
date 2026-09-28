"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Plus, Save, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Input";
import { useCurrencies } from "@/features/invoices/hooks";
import { useCreateExpenseCategory, useExpenseCategories } from "@/features/expenses/hooks";
import type { Expense } from "@/lib/api/types";
import { toast } from "@/store/toast-store";

const schema = z.object({
  expense_category_id: z.number().int().min(1, "Choose a category"),
  currency_id: z.number().int().min(1, "Choose a currency"),
  amount: z.number().positive("Amount must be greater than zero"),
  expense_date: z.string().min(1, "Date is required"),
  vendor: z.string().max(255).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
});

export type ExpenseFormValues = z.infer<typeof schema>;

interface ExpenseFormProps {
  defaultValues?: Expense;
  onSubmit: (values: ExpenseFormValues, receipt: File | null, removeReceipt: boolean) => Promise<void>;
  submitLabel?: string;
  canManageCategories?: boolean;
}

export function ExpenseForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save expense",
  canManageCategories = false,
}: ExpenseFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useExpenseCategories();
  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const createCategory = useCreateExpenseCategory();

  const [receipt, setReceipt] = useState<File | null>(null);
  const [removeReceipt, setRemoveReceipt] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultCurrencyId = currencies?.find((c) => c.is_default)?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      expense_category_id: defaultValues?.category?.id ?? 0,
      currency_id: defaultValues?.currency?.id ?? defaultCurrencyId ?? 0,
      amount: defaultValues?.amount ?? 0,
      expense_date: defaultValues?.expense_date ?? new Date().toISOString().slice(0, 10),
      vendor: defaultValues?.vendor ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      setRemoveReceipt(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory.mutateAsync(newCategoryName.trim());
      toast.success(`Category "${newCategoryName.trim()}" added.`);
      setNewCategoryName("");
      setAddingCategory(false);
    } catch {
      toast.error("Couldn't add that category — it may already exist.");
    }
  };

  const submit = handleSubmit((values) => onSubmit(values, receipt, removeReceipt));

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="expense_category_id">Category</Label>
          <Select
            id="expense_category_id"
            disabled={categoriesLoading}
            error={errors.expense_category_id?.message}
            {...register("expense_category_id", { setValueAs: (v) => Number(v) })}
          >
            <option value="">Select a category…</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError>{errors.expense_category_id?.message}</FieldError>

          {canManageCategories && (
            <div className="mt-2">
              {addingCategory ? (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={createCategory.isPending}
                    onClick={handleAddCategory}
                  >
                    {createCategory.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setAddingCategory(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  onClick={() => setAddingCategory(true)}
                >
                  <Plus className="h-3 w-3" /> Add a category
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="currency_id">Currency</Label>
          <Select
            id="currency_id"
            disabled={currenciesLoading}
            error={errors.currency_id?.message}
            {...register("currency_id", { setValueAs: (v) => Number(v) })}
          >
            {currencies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </Select>
          <FieldError>{errors.currency_id?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            error={errors.amount?.message}
            {...register("amount", { setValueAs: (v) => Number(v) })}
          />
          <FieldError>{errors.amount?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="expense_date">Date</Label>
          <Input id="expense_date" type="date" error={errors.expense_date?.message} {...register("expense_date")} />
          <FieldError>{errors.expense_date?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="vendor">Vendor (optional)</Label>
          <Input id="vendor" placeholder="e.g. TANESCO" {...register("vendor")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <div className="sm:col-span-2">
          <Label>Receipt (optional)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              {receipt || (defaultValues?.receipt_url && !removeReceipt) ? "Replace" : "Upload"}
            </Button>

            {receipt && (
              <span className="flex items-center gap-1 text-sm text-foreground-muted">
                <FileText className="h-4 w-4" /> {receipt.name}
              </span>
            )}

            {!receipt && defaultValues?.receipt_url && !removeReceipt && (
              <>
                <a
                  href={defaultValues.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" /> Current receipt
                </a>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-[var(--danger)] hover:underline"
                  onClick={() => setRemoveReceipt(true)}
                >
                  <X className="h-4 w-4" /> Remove
                </button>
              </>
            )}

            {removeReceipt && <span className="text-sm text-foreground-faint">Receipt will be removed.</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
