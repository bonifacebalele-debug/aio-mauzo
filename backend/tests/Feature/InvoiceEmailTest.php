<?php

namespace Tests\Feature;

use App\Mail\InvoiceMail;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\User;
use Database\Seeders\CompanySeeder;
use Database\Seeders\CurrencySeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TaxSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class InvoiceEmailTest extends TestCase
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

    public function test_sending_an_invoice_email_logs_it_and_marks_draft_invoice_as_sent(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $user->assignRole('Sales');

        $customer = Customer::factory()->create();
        $currency = Currency::where('is_default', true)->first();

        $created = $this->actingAs($user)->postJson('/api/invoices', [
            'customer_id' => $customer->id,
            'currency_id' => $currency->id,
            'invoice_date' => now()->toDateString(),
            'items' => [
                ['description' => 'Service A', 'quantity' => 1, 'unit_price' => 100],
            ],
        ]);
        $invoiceId = $created->json('data.id');

        $response = $this->actingAs($user)->postJson("/api/invoices/{$invoiceId}/email", [
            'to_email' => 'customer@example.com',
            'subject' => 'Your invoice',
            'message' => 'Please find your invoice attached.',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.status', 'sent');

        $this->assertDatabaseHas('email_logs', [
            'invoice_id' => $invoiceId,
            'to_email' => 'customer@example.com',
            'status' => 'sent',
        ]);

        $this->assertDatabaseHas('invoices', [
            'id' => $invoiceId,
            'status' => 'sent',
        ]);

        Mail::assertSent(InvoiceMail::class);
    }
}
