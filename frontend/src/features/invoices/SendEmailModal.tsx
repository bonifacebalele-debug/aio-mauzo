"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { extractErrorMessage } from "@/lib/api/client";
import type { Invoice } from "@/lib/api/types";
import { formatDateTime, formatMoney } from "@/lib/utils/format";
import { toast } from "@/store/toast-store";
import { useInvoiceEmailHistory, useSendInvoiceEmail } from "./hooks";

const schema = z.object({
  to_email: z.string().min(1, "Recipient email is required").email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(255),
  message: z.string().min(1, "Message is required").max(5000),
});

type FormValues = z.infer<typeof schema>;

export function SendEmailModal({
  invoice,
  open,
  onClose,
}: {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
}) {
  const sendEmail = useSendInvoiceEmail(invoice.id);
  const { data: history } = useInvoiceEmailHistory(invoice.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      to_email: invoice.customer.email ?? "",
      subject: `Invoice ${invoice.invoice_number} from AIO Technologies`,
      message: `Please find your invoice ${invoice.invoice_number} for ${formatMoney(invoice.grand_total, invoice.currency.symbol)}.`,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await sendEmail.mutateAsync(values);
      toast.success(`Invoice emailed to ${values.to_email}.`);
      reset(values);
      onClose();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Email Invoice" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="to_email">To</Label>
          <Input id="to_email" type="email" error={errors.to_email?.message} {...register("to_email")} />
          <FieldError>{errors.to_email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" error={errors.subject?.message} {...register("subject")} />
          <FieldError>{errors.subject?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={4} error={errors.message?.message} {...register("message")} />
          <FieldError>{errors.message?.message}</FieldError>
        </div>
        {!invoice.pdf_url && (
          <p className="text-xs text-foreground-faint">
            No PDF has been generated yet — this email will be sent without an attachment. Generate the PDF first to
            include it.
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send email
          </Button>
        </div>
      </form>

      {!!history?.length && (
        <div className="mt-6 border-t border-[var(--border)] pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Email History</p>
          <ul className="space-y-2">
            {history.map((log) => (
              <li key={log.id} className="flex items-start gap-2 text-sm">
                {log.status === "sent" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--danger)]" />
                )}
                <div className="min-w-0">
                  <p className="truncate">{log.to_email}</p>
                  <p className="text-xs text-foreground-faint">{formatDateTime(log.sent_at ?? log.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
