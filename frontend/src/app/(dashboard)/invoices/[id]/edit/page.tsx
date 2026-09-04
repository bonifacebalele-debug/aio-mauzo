"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { InvoiceForm, type InvoiceFormValues } from "@/features/invoices/InvoiceForm";
import { useInvoice, useUpdateInvoice } from "@/features/invoices/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoiceId = Number(id);
  const router = useRouter();

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const updateInvoice = useUpdateInvoice(invoiceId);

  const handleSubmit = async (values: InvoiceFormValues) => {
    try {
      await updateInvoice.mutateAsync({
        customer_id: values.customer_id,
        currency_id: values.currency_id,
        reference: values.reference || null,
        invoice_date: values.invoice_date,
        due_date: values.due_date || null,
        notes: values.notes || null,
        terms: values.terms || null,
        items: values.items,
      });
      toast.success("Invoice updated.");
      router.push(`/invoices/${invoiceId}`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !invoice) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Invoice" description={invoice.invoice_number} />
      <InvoiceForm defaultValues={invoice} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}
