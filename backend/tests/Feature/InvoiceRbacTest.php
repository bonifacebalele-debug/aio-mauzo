<?php

namespace Tests\Feature;

use App\Models\Currency;
use App\Models\Customer;
use App\Models\User;
use Database\Seeders\CompanySeeder;
use Database\Seeders\CurrencySeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\TaxSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceRbacTest extends TestCase
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

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    private function invoicePayload(): array
    {
        $customer = Customer::factory()->create();
        $currency = Currency::where('is_default', true)->first();

        return [
            'customer_id' => $customer->id,
            'currency_id' => $currency->id,
            'invoice_date' => now()->toDateString(),
            'items' => [
                ['description' => 'Service A', 'quantity' => 1, 'unit_price' => 100],
            ],
        ];
    }

    public function test_sales_can_create_an_invoice_with_correct_totals(): void
    {
        $user = $this->userWithRole('Sales');

        $response = $this->actingAs($user)->postJson('/api/invoices', $this->invoicePayload());

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'draft');
        $response->assertJsonPath('data.grand_total', 100);
    }

    public function test_viewer_cannot_create_an_invoice(): void
    {
        $user = $this->userWithRole('Viewer');

        $response = $this->actingAs($user)->postJson('/api/invoices', $this->invoicePayload());

        $response->assertForbidden();
    }

    public function test_sales_cannot_change_invoice_status_but_accountant_can(): void
    {
        $sales = $this->userWithRole('Sales');
        $accountant = $this->userWithRole('Accountant');

        $created = $this->actingAs($sales)->postJson('/api/invoices', $this->invoicePayload());
        $invoiceId = $created->json('data.id');

        $deniedResponse = $this->actingAs($sales)->patchJson("/api/invoices/{$invoiceId}/status", ['status' => 'sent']);
        $deniedResponse->assertForbidden();

        $allowedResponse = $this->actingAs($accountant)->patchJson("/api/invoices/{$invoiceId}/status", ['status' => 'sent']);
        $allowedResponse->assertOk();
        $allowedResponse->assertJsonPath('data.status', 'sent');
    }

    public function test_invalid_status_transition_is_rejected(): void
    {
        $accountant = $this->userWithRole('Accountant');
        $sales = $this->userWithRole('Sales');

        $created = $this->actingAs($sales)->postJson('/api/invoices', $this->invoicePayload());
        $invoiceId = $created->json('data.id');

        // draft -> paid is not an allowed direct transition
        $response = $this->actingAs($accountant)->patchJson("/api/invoices/{$invoiceId}/status", ['status' => 'paid']);

        $response->assertUnprocessable();
    }
}
