<?php

namespace Database\Seeders;

use App\DTOs\InvoiceData;
use App\Enums\InvoiceStatus;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Tax;
use App\Models\User;
use App\Services\InvoiceService;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $invoiceService = app(InvoiceService::class);

        $admin = User::where('email', 'admin@aio-mauzo.local')->first();
        $currency = Currency::where('is_default', true)->first() ?? Currency::first();
        $vat = Tax::where('is_default', true)->first();
        $customers = Customer::all();

        if (! $admin || ! $currency || $customers->isEmpty()) {
            return;
        }

        $sampleDescriptions = [
            'Website design and development services',
            'Monthly IT support retainer',
            'Cloud hosting and maintenance',
            'Point of sale system installation',
            'Network cabling and setup',
            'Software license renewal',
            'Consulting services',
            'Hardware supply and delivery',
        ];

        // Deterministic demo data — do not randomize timings across runs.
        $plan = [
            ['daysAgo' => 35, 'status' => InvoiceStatus::Paid],
            ['daysAgo' => 28, 'status' => InvoiceStatus::Paid],
            ['daysAgo' => 20, 'status' => InvoiceStatus::Sent],
            ['daysAgo' => 14, 'status' => InvoiceStatus::Viewed],
            ['daysAgo' => 10, 'status' => InvoiceStatus::Draft],
            ['daysAgo' => 3, 'status' => InvoiceStatus::Sent],
            ['daysAgo' => 1, 'status' => InvoiceStatus::Draft],
            ['daysAgo' => 0, 'status' => InvoiceStatus::Draft],
        ];

        foreach ($plan as $index => $entry) {
            $customer = $customers[$index % $customers->count()];
            $invoiceDate = now()->subDays($entry['daysAgo']);

            $items = collect(range(1, random_int(1, 3)))->map(fn () => [
                'description' => $sampleDescriptions[array_rand($sampleDescriptions)],
                'quantity' => random_int(1, 5),
                'unit' => 'pcs',
                'unit_price' => random_int(50, 500) * 1000,
                'discount_type' => 'percent',
                'discount_value' => random_int(0, 1) ? 5 : 0,
                'tax_id' => $vat?->id,
                'tax_rate' => $vat?->rate ?? 0,
            ])->all();

            $invoice = $invoiceService->create(
                InvoiceData::fromArray([
                    'customer_id' => $customer->id,
                    'currency_id' => $currency->id,
                    'invoice_date' => $invoiceDate->toDateString(),
                    'due_date' => $invoiceDate->copy()->addDays(14)->toDateString(),
                    'notes' => 'Thank you for your business.',
                    'items' => $items,
                ]),
                $admin,
            );

            if ($entry['status'] !== InvoiceStatus::Draft) {
                foreach ($this->transitionPath($entry['status']) as $status) {
                    $invoice = $invoiceService->updateStatus($invoice, $status, $admin);
                }
            }

            if ($entry['status'] === InvoiceStatus::Paid) {
                $invoice->payments()->create([
                    'amount' => $invoice->grand_total,
                    'payment_date' => $invoiceDate->copy()->addDays(5)->toDateString(),
                    'payment_method' => 'Bank Transfer',
                    'reference' => 'PMT-'.$invoice->invoice_number,
                    'recorded_by' => $admin->id,
                ]);
                $invoice->update(['amount_paid' => $invoice->grand_total]);
            }
        }
    }

    /**
     * @return InvoiceStatus[]
     */
    private function transitionPath(InvoiceStatus $target): array
    {
        return match ($target) {
            InvoiceStatus::Sent => [InvoiceStatus::Sent],
            InvoiceStatus::Viewed => [InvoiceStatus::Sent, InvoiceStatus::Viewed],
            InvoiceStatus::Paid => [InvoiceStatus::Sent, InvoiceStatus::Viewed, InvoiceStatus::Paid],
            InvoiceStatus::Cancelled => [InvoiceStatus::Sent, InvoiceStatus::Cancelled],
            default => [],
        };
    }
}
