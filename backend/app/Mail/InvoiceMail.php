<?php

namespace App\Mail;

use App\Models\Company;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Invoice $invoice,
        public readonly Company $company,
        public readonly string $customSubject,
        public readonly string $customMessage,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->customSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.invoice',
            with: [
                'invoice' => $this->invoice,
                'company' => $this->company,
                'customMessage' => $this->customMessage,
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        if (! $this->invoice->pdf_path || ! Storage::disk('public')->exists($this->invoice->pdf_path)) {
            return [];
        }

        return [
            Attachment::fromStorageDisk('public', $this->invoice->pdf_path)
                ->as("{$this->invoice->invoice_number}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
