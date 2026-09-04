"use client";

import {
  Copy,
  Download,
  FileDown,
  Loader2,
  Mail,
  MessageCircle,
  Pencil,
  Printer,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusPill } from "@/components/ui/StatusPill";
import { InvoicePrintPreview } from "@/features/invoices/InvoicePrintPreview";
import { SendEmailModal } from "@/features/invoices/SendEmailModal";
import { StatusActions } from "@/features/invoices/StatusActions";
import { useDeleteInvoice, useGenerateInvoicePdf, useInvoice } from "@/features/invoices/hooks";
import { useCompanySettings } from "@/features/settings/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { buildWhatsAppShareLink } from "@/lib/utils/whatsapp";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoiceId = Number(id);
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: company } = useCompanySettings();
  const generatePdf = useGenerateInvoicePdf();
  const deleteInvoice = useDeleteInvoice();

  const handleGeneratePdf = async () => {
    try {
      const result = await generatePdf.mutateAsync(invoiceId);
      toast.success("PDF generated.");
      window.open(result.pdf_url, "_blank");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleCopyLink = async () => {
    const url = invoice?.pdf_url ?? window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard.");
  };

  const handleDelete = async () => {
    if (!invoice) return;
    try {
      await deleteInvoice.mutateAsync(invoice.id);
      toast.success(`Invoice ${invoice.invoice_number} deleted.`);
      router.push("/invoices");
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{invoice.invoice_number}</h1>
          <StatusPill status={invoice.status} label={invoice.status_label} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusActions invoice={invoice} canManage={hasPermission("invoices.manage_status")} />

          {hasPermission("invoices.edit") && (
            <Link href={`/invoices/${invoice.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}>
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          )}

          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" /> Copy Link
          </Button>

          <a
            href={buildWhatsAppShareLink(invoice)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", size: "sm", className: "gap-1.5" })}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>

          {hasPermission("invoices.edit") && (
            <Button variant="outline" size="sm" onClick={() => setEmailModalOpen(true)}>
              <Mail className="h-4 w-4" /> Email
            </Button>
          )}

          {invoice.pdf_url ? (
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "sm", className: "gap-1.5" })}
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          ) : (
            <Button size="sm" onClick={handleGeneratePdf} disabled={generatePdf.isPending}>
              {generatePdf.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Generate PDF
            </Button>
          )}

          {invoice.pdf_url && (
            <Button variant="ghost" size="sm" onClick={handleGeneratePdf} disabled={generatePdf.isPending}>
              {generatePdf.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Regenerate"}
            </Button>
          )}

          {hasPermission("invoices.delete") && (
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)} aria-label="Delete invoice">
              <Trash2 className="h-4 w-4 text-[var(--danger)]" />
            </Button>
          )}
        </div>
      </div>

      <InvoicePrintPreview invoice={invoice} company={company} />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete invoice"
        description={`This will remove invoice "${invoice.invoice_number}".`}
        loading={deleteInvoice.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <SendEmailModal invoice={invoice} open={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
    </div>
  );
}
