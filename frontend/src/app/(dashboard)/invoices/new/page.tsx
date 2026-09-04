"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { InvoiceForm, type InvoiceFormValues } from "@/features/invoices/InvoiceForm";
import { useCreateInvoice } from "@/features/invoices/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

export default function NewInvoicePage() {
  const router = useRouter();
  const createInvoice = useCreateInvoice();

  const handleSubmit = async (values: InvoiceFormValues) => {
    try {
      const invoice = await createInvoice.mutateAsync({
        customer_id: values.customer_id,
        currency_id: values.currency_id,
        reference: values.reference || null,
        invoice_date: values.invoice_date,
        due_date: values.due_date || null,
        notes: values.notes || null,
        terms: values.terms || null,
        items: values.items,
      });
      toast.success(`Invoice ${invoice.invoice_number} created.`);
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader title="New Invoice" description="Create a new invoice for a customer" />
      <InvoiceForm onSubmit={handleSubmit} submitLabel="Create invoice" />
    </div>
  );
}
