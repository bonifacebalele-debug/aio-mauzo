"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Input";
import { CustomerCombobox } from "@/features/customers/CustomerCombobox";
import type { Customer, Invoice } from "@/lib/api/types";
import { calculateInvoice } from "@/lib/utils/calculations";
import { formatMoney } from "@/lib/utils/format";
import { useCurrencies, useTaxes } from "./hooks";

const itemSchema = z.object({
  description: z.string().min(1, "Required"),
  quantity: z.number().min(0.01, "Must be > 0"),
  unit: z.string().min(1).max(20),
  unit_price: z.number().min(0),
  discount_type: z.enum(["percent", "fixed"]),
  discount_value: z.number().min(0),
  tax_id: z.number().nullable(),
  tax_rate: z.number().min(0).max(100),
});

const schema = z.object({
  customer_id: z.number().min(1, "Select a customer"),
  currency_id: z.number().min(1, "Select a currency"),
  reference: z.string().optional().or(z.literal("")),
  invoice_date: z.string().min(1, "Required"),
  due_date: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  terms: z.string().optional().or(z.literal("")),
  items: z.array(itemSchema).min(1, "Add at least one line item"),
});

export type InvoiceFormValues = z.infer<typeof schema>;

interface InvoiceFormProps {
  defaultValues?: Invoice;
  onSubmit: (values: InvoiceFormValues) => Promise<void>;
  submitLabel?: string;
}

function emptyItem() {
  return {
    description: "",
    quantity: 1,
    unit: "pcs",
    unit_price: 0,
    discount_type: "percent" as const,
    discount_value: 0,
    tax_id: null,
    tax_rate: 0,
  };
}

export function InvoiceForm({ defaultValues, onSubmit, submitLabel = "Save invoice" }: InvoiceFormProps) {
  const { data: currencies } = useCurrencies();
  const { data: taxes } = useTaxes();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(defaultValues?.customer ?? null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_id: defaultValues?.customer.id ?? 0,
      currency_id: defaultValues?.currency.id ?? currencies?.find((c) => c.is_default)?.id ?? 0,
      reference: defaultValues?.reference ?? "",
      invoice_date: defaultValues?.invoice_date ?? new Date().toISOString().slice(0, 10),
      due_date: defaultValues?.due_date ?? "",
      notes: defaultValues?.notes ?? "",
      terms: defaultValues?.terms ?? "",
      items:
        defaultValues?.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          discount_type: item.discount_type,
          discount_value: item.discount_value,
          tax_id: item.tax_id,
          tax_rate: item.tax_rate,
        })) ?? [emptyItem()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");
  const currencyId = watch("currency_id");
  const currency = currencies?.find((c) => c.id === Number(currencyId));

  const totals = useMemo(() => calculateInvoice(watchedItems ?? []), [watchedItems]);

  // Currencies load asynchronously, so the default currency can't always be
  // resolved at useForm's initial defaultValues (it may still be undefined
  // then, leaving currency_id stuck at 0 / "Select currency"). Backfill it
  // once the list arrives, but only if the user hasn't already chosen one.
  useEffect(() => {
    if (defaultValues || currencyId || !currencies?.length) return;

    const fallback = currencies.find((c) => c.is_default) ?? currencies[0];
    if (fallback) setValue("currency_id", fallback.id);
  }, [currencies, currencyId, defaultValues, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Customer</Label>
              <Controller
                control={control}
                name="customer_id"
                render={({ field }) => (
                  <CustomerCombobox
                    value={selectedCustomer}
                    error={errors.customer_id?.message}
                    onChange={(customer) => {
                      setSelectedCustomer(customer);
                      field.onChange(customer.id);
                    }}
                  />
                )}
              />
              <FieldError>{errors.customer_id?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="currency_id">Currency</Label>
              <Select id="currency_id" {...register("currency_id", { setValueAs: (v) => Number(v) })}>
                <option value={0} disabled>
                  Select currency
                </option>
                {currencies?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </Select>
              <FieldError>{errors.currency_id?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" {...register("reference")} />
            </div>

            <div>
              <Label htmlFor="invoice_date">Invoice Date</Label>
              <Input id="invoice_date" type="date" error={errors.invoice_date?.message} {...register("invoice_date")} />
              <FieldError>{errors.invoice_date?.message}</FieldError>
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={() => append(emptyItem())}>
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldError>{errors.items?.message as string | undefined}</FieldError>

            {fields.map((field, index) => {
              const line = totals.lines[index];

              return (
                <div key={field.id} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Label>Description</Label>
                      <Input
                        error={errors.items?.[index]?.description?.message}
                        {...register(`items.${index}.description`)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.quantity`, { setValueAs: (v) => Number(v) })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Unit</Label>
                      <Input {...register(`items.${index}.unit`)} />
                    </div>
                    <div className="sm:col-span-3">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.unit_price`, { setValueAs: (v) => Number(v) })}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Label>Discount Type</Label>
                      <Select {...register(`items.${index}.discount_type`)}>
                        <option value="percent">Percent (%)</option>
                        <option value="fixed">Fixed amount</option>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Discount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.discount_value`, { setValueAs: (v) => Number(v) })}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <Label>Tax</Label>
                      <Controller
                        control={control}
                        name={`items.${index}.tax_id`}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const tax = rawValue === "" ? undefined : taxes?.find((t) => t.id === Number(rawValue));
                              field.onChange(tax?.id ?? null);
                              setValue(`items.${index}.tax_rate`, Number(tax?.rate ?? 0), { shouldValidate: true });
                            }}
                          >
                            <option value="">No tax</option>
                            {taxes?.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.rate}%)
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      <FieldError>
                        {errors.items?.[index]?.tax_id?.message ?? errors.items?.[index]?.tax_rate?.message}
                      </FieldError>
                    </div>
                    <div className="flex items-end justify-between gap-2 sm:col-span-3">
                      <div className="w-full">
                        <Label>Line Total</Label>
                        <p className="h-10 flex items-center text-sm font-semibold tabular-nums">
                          {formatMoney(line?.total ?? 0, currency?.symbol)}
                        </p>
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mb-1 shrink-0 rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes &amp; Terms</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>
            <div>
              <Label htmlFor="terms">Terms</Label>
              <Textarea id="terms" rows={3} {...register("terms")} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="font-medium tabular-nums">{formatMoney(totals.subtotal, currency?.symbol)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Discount</span>
              <span className="font-medium tabular-nums text-[var(--danger)]">
                −{formatMoney(totals.discountTotal, currency?.symbol)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Tax</span>
              <span className="font-medium tabular-nums">{formatMoney(totals.taxTotal, currency?.symbol)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 text-base">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold tabular-nums text-primary">
                {formatMoney(totals.grandTotal, currency?.symbol)}
              </span>
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {submitLabel}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
