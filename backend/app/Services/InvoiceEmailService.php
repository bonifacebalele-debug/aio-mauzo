<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Mail\InvoiceMail;
use App\Models\Company;
use App\Models\EmailLog;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Throwable;

class InvoiceEmailService
{
    public function __construct(
        private readonly InvoiceService $invoices,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function send(Invoice $invoice, string $toEmail, string $subject, string $message, User $actor): EmailLog
    {
        $company = Company::query()->firstOrFail();

        $log = EmailLog::create([
            'invoice_id' => $invoice->id,
            'to_email' => $toEmail,
            'subject' => $subject,
            'message' => $message,
            'status' => 'queued',
            'sent_by' => $actor->id,
        ]);

        try {
            Mail::to($toEmail)->send(new InvoiceMail($invoice, $company, $subject, $message));

            $log->update(['status' => 'sent', 'sent_at' => now()]);

            $invoice->history()->create([
                'action' => 'sent',
                'description' => "Emailed to {$toEmail}",
                'user_id' => $actor->id,
            ]);

            if ($invoice->status === InvoiceStatus::Draft) {
                $this->invoices->updateStatus($invoice, InvoiceStatus::Sent, $actor);
            }
        } catch (Throwable $e) {
            $log->update(['status' => 'failed', 'provider_response' => $e->getMessage()]);
            $this->activityLogger->log($actor, 'invoice.email_failed', $invoice, "Email to {$toEmail} failed: {$e->getMessage()}");

            throw $e;
        }

        return $log;
    }
}
