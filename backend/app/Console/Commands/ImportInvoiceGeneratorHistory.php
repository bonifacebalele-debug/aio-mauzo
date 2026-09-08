<?php

namespace App\Console\Commands;

use App\Enums\InvoiceStatus;
use App\Models\Company;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * One-time importer for the CSV export from Invoice-Generator.com's
 * "History" page (History -> Export). That export has one row per
 * invoice LINE ITEM, with invoice-level fields (customer, number,
 * date, totals, notes, terms...) repeated on every row belonging to
 * the same invoice. This command groups rows back into invoices,
 * finds-or-creates the matching customer, and creates the invoice
 * with its line items.
 *
 * This does NOT talk to any Invoice-Generator.com API — no such API
 * exists for historical data. It only reads the spreadsheet file you
 * already exported by hand.
 */
class ImportInvoiceGeneratorHistory extends Command
{
    protected $signature = 'import:invoice-generator
        {path : Path to the exported CSV file}
        {--user= : Email of the user to record as the importer (defaults to the first Administrator)}
        {--dry-run : Preview what would be imported without writing anything}';

    protected $description = 'Import historical invoices + customers from an Invoice-Generator.com CSV export';

    public function handle(): int
    {
        $path = $this->argument('path');

        if (! is_file($path)) {
            $this->error("File not found: {$path}");

            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');

        $actor = $this->resolveActor();
        if (! $actor) {
            return self::FAILURE;
        }

        $company = Company::query()->first();
        if (! $company) {
            $this->error('No company record found. Seed/create a Company before importing.');

            return self::FAILURE;
        }

        $rows = $this->readCsv($path);
        if (empty($rows)) {
            $this->error('No data rows found in the CSV.');

            return self::FAILURE;
        }

        // Group rows into invoices by `number`. The export is one row per
        // line item with invoice-level fields repeated, but occasionally
        // the SAME printed number was reused (by hand, in the original
        // invoicing) for two genuinely different invoices. Detect that by
        // comparing (customer, date, total) — if it changes for a repeated
        // number, treat it as a separate invoice and disambiguate the
        // stored invoice_number so nothing gets silently merged.
        $groups = [];
        $openNumberToKey = [];
        $duplicateNumbers = [];

        foreach ($rows as $row) {
            $number = trim($row['number'] ?? '');
            if ($number === '') {
                continue;
            }

            $signature = implode('|', [
                trim($row['customer'] ?? ''),
                trim($row['date'] ?? ''),
                trim($row['total'] ?? ''),
            ]);

            $key = $number;
            if (isset($openNumberToKey[$number])) {
                $existingKey = $openNumberToKey[$number];
                if ($groups[$existingKey]['signature'] === $signature) {
                    $key = $existingKey;
                } else {
                    $suffix = 2;
                    do {
                        $key = "{$number}-{$suffix}";
                        $suffix++;
                    } while (isset($groups[$key]));
                    $duplicateNumbers[$number] = true;
                    $openNumberToKey[$number] = $key;
                }
            } else {
                $openNumberToKey[$number] = $key;
            }

            $groups[$key]['number'] = $number;
            $groups[$key]['signature'] = $signature;
            $groups[$key]['items'][] = $row;
        }

        $this->info(sprintf(
            '%d row(s) parsed into %d invoice(s). %s',
            count($rows),
            count($groups),
            $dryRun ? 'DRY RUN — nothing will be written.' : 'Importing...'
        ));

        if ($duplicateNumbers) {
            $this->warn(sprintf(
                '%d printed invoice number(s) were reused for genuinely different invoices in the source export (different customer/date/total). Each was kept as a separate invoice with a disambiguated number: %s',
                count($duplicateNumbers),
                implode(', ', array_keys($duplicateNumbers)),
            ));
        }

        $customersCreated = 0;
        $customersReused = 0;
        $invoicesCreated = 0;
        $invoicesSkipped = [];

        $bar = $this->output->createProgressBar(count($groups));
        $bar->start();

        foreach ($groups as $number => $group) {
            $bar->advance();
            $items = $group['items'];

            try {
                $head = $items[0];
                $customerName = trim($head['customer'] ?? '');

                if ($customerName === '') {
                    $invoicesSkipped[] = "{$number}: missing customer name";

                    continue;
                }

                if (Invoice::query()->where('invoice_number', $number)->exists()) {
                    $invoicesSkipped[] = "{$number}: already imported (invoice_number exists)";

                    continue;
                }

                $invoiceDate = $this->parseDate($head['date'] ?? null);
                if (! $invoiceDate) {
                    $invoicesSkipped[] = "{$number}: unparseable date '{$head['date']}'";

                    continue;
                }

                if ($dryRun) {
                    $existing = $this->findCustomer($customerName);
                    $existing ? $customersReused++ : $customersCreated++;
                    $invoicesCreated++;

                    continue;
                }

                DB::transaction(function () use ($items, $head, $number, $customerName, $invoiceDate, $company, $actor, &$customersCreated, &$customersReused) {
                    $customer = $this->findCustomer($customerName);
                    if ($customer) {
                        $customersReused++;
                    } else {
                        $customer = Customer::create([
                            'company_id' => $company->id,
                            'company_name' => $customerName,
                            'is_active' => true,
                            'created_by' => $actor->id,
                            'notes' => 'Imported from Invoice-Generator.com export.',
                        ]);
                        $customersCreated++;
                    }

                    $currency = $this->findOrCreateCurrency(trim($head['currency'] ?? '') ?: 'TZS');

                    $dueDate = $this->parseDate($head['due_date'] ?? null);

                    $lines = [];
                    $subtotal = 0.0;
                    $discountTotal = 0.0;
                    $taxTotal = 0.0;
                    $grandTotal = 0.0;

                    foreach ($items as $sort => $row) {
                        $quantity = (float) ($row['quantity'] !== '' ? $row['quantity'] : 1);
                        $unitPrice = (float) ($row['unit_cost'] !== '' ? $row['unit_cost'] : 0);
                        $discountAmount = round((float) ($row['discount'] !== '' ? $row['discount'] : 0), 2);
                        $taxAmount = round((float) ($row['tax'] !== '' ? $row['tax'] : 0), 2);

                        $lineSubtotal = round($quantity * $unitPrice, 2);
                        $discountAmount = min($discountAmount, $lineSubtotal);
                        $taxable = $lineSubtotal - $discountAmount;
                        $taxRate = $taxable > 0 ? round($taxAmount / $taxable * 100, 3) : 0.0;
                        $lineTotal = round($taxable + $taxAmount, 2);

                        $description = trim(($row['item'] ?? '').(($row['description'] ?? '') !== '' ? "\n".$row['description'] : ''));
                        if ($description === '') {
                            $description = 'Item';
                        }

                        $lines[] = [
                            'description' => $description,
                            'quantity' => $quantity ?: 1,
                            'unit' => 'pcs',
                            'unit_price' => $unitPrice,
                            'discount_type' => 'fixed',
                            'discount_value' => $discountAmount,
                            'tax_rate' => $taxRate,
                            'subtotal' => $lineSubtotal,
                            'discount_amount' => $discountAmount,
                            'tax_amount' => $taxAmount,
                            'total' => $lineTotal,
                            'sort_order' => $sort,
                        ];

                        $subtotal += $lineSubtotal;
                        $discountTotal += $discountAmount;
                        $taxTotal += $taxAmount;
                        $grandTotal += $lineTotal;
                    }

                    $exportedTotal = (float) ($head['total'] !== '' ? $head['total'] : $grandTotal);
                    $amountPaid = (float) ($head['amount_paid'] !== '' ? $head['amount_paid'] : 0);
                    $balance = $head['balance'] !== '' ? (float) $head['balance'] : ($exportedTotal - $amountPaid);

                    $status = $balance <= 0.009 && $exportedTotal > 0
                        ? InvoiceStatus::Paid
                        : InvoiceStatus::Sent;

                    $invoice = Invoice::create([
                        'company_id' => $company->id,
                        'customer_id' => $customer->id,
                        'currency_id' => $currency->id,
                        'invoice_number' => $number,
                        'reference' => trim($head['purchase_order'] ?? '') ?: null,
                        'invoice_date' => $invoiceDate,
                        'due_date' => $dueDate,
                        'status' => $status,
                        'subtotal' => round($subtotal, 2),
                        'discount_total' => round($discountTotal, 2),
                        'tax_total' => round($taxTotal, 2),
                        'grand_total' => round($exportedTotal, 2),
                        'amount_paid' => round($amountPaid, 2),
                        'notes' => trim($head['notes'] ?? '') ?: null,
                        'terms' => trim($head['terms'] ?? '') ?: null,
                        'prepared_by' => $actor->id,
                        'created_by' => $actor->id,
                        'sent_at' => $invoiceDate,
                        'paid_at' => $status === InvoiceStatus::Paid ? $invoiceDate : null,
                    ]);

                    foreach ($lines as $line) {
                        $invoice->items()->create($line);
                    }

                    $invoice->history()->create([
                        'action' => 'created',
                        'description' => "Invoice {$invoice->invoice_number} imported from Invoice-Generator.com export",
                        'user_id' => $actor->id,
                    ]);
                });

                $invoicesCreated++;
            } catch (\Throwable $e) {
                $invoicesSkipped[] = "{$number}: ".$e->getMessage();
            }
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Invoices imported: {$invoicesCreated}");
        $this->info("Customers created: {$customersCreated}");
        $this->info("Customers matched to existing records: {$customersReused}");

        if ($invoicesSkipped) {
            $this->warn(count($invoicesSkipped).' invoice(s) skipped:');
            foreach ($invoicesSkipped as $reason) {
                $this->line("  - {$reason}");
            }
        }

        if ($dryRun) {
            $this->comment('Dry run only — nothing was written. Re-run without --dry-run to actually import.');
        }

        return self::SUCCESS;
    }

    private function resolveActor(): ?User
    {
        $email = $this->option('user');

        $query = User::query();
        $user = $email
            ? $query->where('email', $email)->first()
            : $query->whereHas('roles', fn ($q) => $q->where('name', 'Administrator'))->first();

        if (! $user) {
            $this->error($email
                ? "No user found with email {$email}"
                : 'No Administrator user found. Pass --user=you@example.com explicitly.');

            return null;
        }

        return $user;
    }

    private function findCustomer(string $name): ?Customer
    {
        return Customer::query()
            ->whereRaw('LOWER(TRIM(company_name)) = ?', [Str::lower(trim($name))])
            ->first();
    }

    private function findOrCreateCurrency(string $code): Currency
    {
        $code = strtoupper($code) ?: 'TZS';

        return Currency::query()->firstOrCreate(
            ['code' => $code],
            ['name' => $code, 'symbol' => $code, 'is_default' => false],
        );
    }

    private function parseDate(?string $value): ?string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }

        try {
            return Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function readCsv(string $path): array
    {
        $handle = fopen($path, 'r');
        if ($handle === false) {
            return [];
        }

        // Strip a UTF-8 BOM if present so the first header cell parses cleanly.
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            fclose($handle);

            return [];
        }
        $header = array_map(fn ($h) => trim((string) $h), $header);

        $rows = [];
        while (($line = fgetcsv($handle)) !== false) {
            if (count($line) === 1 && $line[0] === null) {
                continue;
            }
            $line = array_pad($line, count($header), '');
            $rows[] = array_combine($header, array_slice($line, 0, count($header)));
        }

        fclose($handle);

        return $rows;
    }
}
