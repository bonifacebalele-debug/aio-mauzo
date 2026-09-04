<?php

namespace App\Services;

use App\Exceptions\InvoiceGeneratorException;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\Upload;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/**
 * Server-side proxy for the Invoice-Generator.com PDF rendering API.
 * The API key never leaves the backend — see config/services.php
 * (services.invoice_generator.key, sourced from INVOICE_GENERATOR_API_KEY).
 *
 * API reference: https://invoice-generator.com/developers
 */
class InvoiceGeneratorService
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    /**
     * Generate (or regenerate) the PDF for an invoice, cache it to local
     * storage, and return the invoice with its updated pdf_path.
     */
    public function generate(Invoice $invoice, User $actor): Invoice
    {
        $apiKey = config('services.invoice_generator.key');

        if (blank($apiKey)) {
            throw InvoiceGeneratorException::missingApiKey();
        }

        $invoice->loadMissing(['items', 'customer', 'currency', 'company']);
        $company = $invoice->company ?? Company::query()->firstOrFail();

        $response = Http::withToken($apiKey)
            ->asJson()
            ->timeout(30)
            ->post(rtrim(config('services.invoice_generator.url'), '/'), $this->buildPayload($invoice, $company));

        if ($response->failed()) {
            throw InvoiceGeneratorException::requestFailed(
                $response->json('error') ?? $response->reason() ?? "HTTP {$response->status()}"
            );
        }

        $path = "invoices/{$invoice->id}-{$invoice->invoice_number}.pdf";
        Storage::disk('public')->put($path, $response->body());

        $invoice->update([
            'pdf_path' => $path,
            'pdf_generated_at' => now(),
        ]);

        Upload::create([
            'uploadable_type' => Invoice::class,
            'uploadable_id' => $invoice->id,
            'disk' => 'public',
            'path' => $path,
            'original_name' => basename($path),
            'mime_type' => 'application/pdf',
            'size' => Storage::disk('public')->size($path),
            'uploaded_by' => $actor->id,
        ]);

        $invoice->history()->create([
            'action' => 'pdf_generated',
            'description' => "PDF generated for invoice {$invoice->invoice_number}",
            'user_id' => $actor->id,
        ]);

        return $invoice->fresh(['items', 'customer', 'currency']);
    }

    public function pdfUrl(Invoice $invoice): ?string
    {
        return $invoice->pdf_path ? Storage::disk('public')->url($invoice->pdf_path) : null;
    }

    private function buildPayload(Invoice $invoice, Company $company): array
    {
        $from = collect([
            $company->name,
            $company->address,
            $company->phone,
            $company->email,
            $company->tin ? "TIN: {$company->tin}" : null,
            $company->vrn ? "VRN: {$company->vrn}" : null,
        ])->filter()->implode("\n");

        $to = collect([
            $invoice->customer->company_name,
            $invoice->customer->contact_person,
            $invoice->customer->physical_address,
            $invoice->customer->phone,
            $invoice->customer->email,
            $invoice->customer->tin ? "TIN: {$invoice->customer->tin}" : null,
        ])->filter()->implode("\n");

        $items = $invoice->items->map(fn ($item) => [
            'name' => str($item->description)->limit(80)->toString(),
            'description' => $item->description,
            'quantity' => (float) $item->quantity,
            'unit_cost' => (float) $item->unit_price,
        ])->values()->all();

        $payload = [
            'from' => $from,
            'to' => $to,
            'logo' => $company->logo_path ? Storage::disk('public')->url($company->logo_path) : null,
            'number' => $invoice->invoice_number,
            'currency' => $invoice->currency->code,
            'date' => $invoice->invoice_date->format('M d, Y'),
            'due_date' => $invoice->due_date?->format('M d, Y'),
            'payment_terms' => $company->payment_instructions,
            'items' => $items,
            'discounts' => (float) $invoice->discount_total,
            'tax' => (float) $invoice->tax_total,
            'amount_paid' => (float) $invoice->amount_paid,
            'notes' => $invoice->notes,
            'terms' => $invoice->terms ?? $company->terms_conditions,
            'fields' => [
                'tax' => true,
                'discounts' => true,
                'shipping' => false,
            ],
        ];

        return array_filter($payload, fn ($value) => $value !== null && $value !== '');
    }
}
