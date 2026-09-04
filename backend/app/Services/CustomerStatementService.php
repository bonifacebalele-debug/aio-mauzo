<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Customer;
use Illuminate\Support\Carbon;

/**
 * Builds a chronological statement of account for a customer: every invoice
 * (a debit) and every payment (a credit), merged into a single running
 * balance — the standard "statement of account" a customer would expect.
 */
class CustomerStatementService
{
    public function generate(Customer $customer, ?string $from, ?string $to): array
    {
        $invoicesQuery = $customer->invoices()
            ->where('status', '!=', InvoiceStatus::Cancelled->value)
            ->with('payments');

        if ($from) {
            $invoicesQuery->whereDate('invoice_date', '>=', Carbon::parse($from));
        }
        if ($to) {
            $invoicesQuery->whereDate('invoice_date', '<=', Carbon::parse($to));
        }

        $invoices = $invoicesQuery->orderBy('invoice_date')->get();

        $entries = collect();

        foreach ($invoices as $invoice) {
            $entries->push([
                'date' => $invoice->invoice_date->toDateString(),
                'type' => 'invoice',
                'reference' => $invoice->invoice_number,
                'description' => "Invoice {$invoice->invoice_number}",
                'debit' => (float) $invoice->grand_total,
                'credit' => 0.0,
            ]);

            foreach ($invoice->payments as $payment) {
                $paymentDate = $payment->payment_date->toDateString();

                if (($from && $paymentDate < $from) || ($to && $paymentDate > $to)) {
                    continue;
                }

                $entries->push([
                    'date' => $paymentDate,
                    'type' => 'payment',
                    'reference' => $payment->reference ?? $invoice->invoice_number,
                    'description' => "Payment for {$invoice->invoice_number}".($payment->payment_method ? " ({$payment->payment_method})" : ''),
                    'debit' => 0.0,
                    'credit' => (float) $payment->amount,
                ]);
            }
        }

        $entries = $entries->sortBy('date')->values();

        $balance = 0.0;
        $entries = $entries->map(function ($entry) use (&$balance) {
            $balance += $entry['debit'] - $entry['credit'];
            $entry['balance'] = round($balance, 2);

            return $entry;
        });

        return [
            'customer' => $customer->only(['id', 'company_name', 'email', 'phone', 'tin']),
            'from' => $from,
            'to' => $to,
            'entries' => $entries,
            'summary' => [
                'total_invoiced' => (float) $invoices->sum('grand_total'),
                'total_paid' => (float) $entries->sum('credit'),
                'closing_balance' => round($balance, 2),
            ],
        ];
    }
}
