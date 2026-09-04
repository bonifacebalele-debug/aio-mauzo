<?php

namespace Tests\Feature;

use App\DTOs\InvoiceData;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\User;
use App\Services\InvoiceService;
use Database\Seeders\CompanySeeder;
use Database\Seeders\CurrencySeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TaxSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
        $this->seed(CurrencySeeder::class);
        $this->seed(TaxSeeder::class);
        $this->seed(CompanySeeder::class);
    }

    private function createInvoice(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $customer = Customer::factory()->create();
        $currency = Currency::where('is_default', true)->first();

        app(InvoiceService::class)->create(
            InvoiceData::fromArray([
                'customer_id' => $customer->id,
                'currency_id' => $currency->id,
                'invoice_date' => now()->toDateString(),
                'items' => [
                    ['description' => 'Widget', 'quantity' => 2, 'unit_price' => 100, 'tax_rate' => 18],
                ],
            ]),
            $admin,
        );
    }

    public function test_accountant_can_view_sales_report(): void
    {
        $this->createInvoice();
        $accountant = User::factory()->create();
        $accountant->assignRole('Accountant');

        $response = $this->actingAs($accountant)->getJson('/api/reports/sales');

        $response->assertOk();
        $response->assertJsonPath('meta.count', 1);
        $response->assertJsonPath('data.0.grand_total', 236);
    }

    public function test_sales_role_cannot_view_reports(): void
    {
        $sales = User::factory()->create();
        $sales->assignRole('Sales');

        $response = $this->actingAs($sales)->getJson('/api/reports/sales');

        $response->assertForbidden();
    }

    public function test_vat_report_breaks_down_by_line_item(): void
    {
        $this->createInvoice();
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->getJson('/api/reports/vat');

        $response->assertOk();
        $response->assertJsonPath('data.0.tax_amount', 36);
    }

    public function test_outstanding_report_excludes_paid_and_cancelled(): void
    {
        $this->createInvoice();
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->getJson('/api/reports/outstanding');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    }

    public function test_csv_export_downloads_successfully(): void
    {
        $this->createInvoice();
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->get('/api/reports/sales/export?format=csv');

        $response->assertOk();
        $this->assertStringContainsString('Invoice #', $response->streamedContent());
    }

    public function test_pdf_export_downloads_successfully(): void
    {
        $this->createInvoice();
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->get('/api/reports/sales/export?format=pdf');

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }

    public function test_customer_statement_computes_running_balance(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $customer = Customer::factory()->create();
        $currency = Currency::where('is_default', true)->first();

        $invoice = app(InvoiceService::class)->create(
            InvoiceData::fromArray([
                'customer_id' => $customer->id,
                'currency_id' => $currency->id,
                'invoice_date' => now()->toDateString(),
                'items' => [
                    ['description' => 'Service', 'quantity' => 1, 'unit_price' => 500],
                ],
            ]),
            $admin,
        );

        $invoice->payments()->create([
            'amount' => 200,
            'payment_date' => now()->toDateString(),
            'recorded_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/customers/{$customer->id}/statement");

        $response->assertOk();
        $response->assertJsonPath('data.summary.total_invoiced', 500);
        $response->assertJsonPath('data.summary.total_paid', 200);
        $response->assertJsonPath('data.summary.closing_balance', 300);
    }
}
