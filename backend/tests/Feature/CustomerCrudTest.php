<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolesAndPermissionsSeeder::class);
    }

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    public function test_sales_user_can_create_a_customer(): void
    {
        $user = $this->userWithRole('Sales');

        $response = $this->actingAs($user)->postJson('/api/customers', [
            'company_name' => 'Acme Traders',
            'phone' => '+255700000001',
            'email' => 'acme@example.com',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.company_name', 'Acme Traders');
        $this->assertDatabaseHas('customers', ['company_name' => 'Acme Traders']);
    }

    public function test_viewer_cannot_create_a_customer(): void
    {
        $user = $this->userWithRole('Viewer');

        $response = $this->actingAs($user)->postJson('/api/customers', [
            'company_name' => 'Blocked Co',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('customers', ['company_name' => 'Blocked Co']);
    }

    public function test_viewer_can_list_customers(): void
    {
        $user = $this->userWithRole('Viewer');
        Customer::factory()->create(['company_name' => 'Existing Co']);

        $response = $this->actingAs($user)->getJson('/api/customers');

        $response->assertOk();
        $response->assertJsonFragment(['company_name' => 'Existing Co']);
    }

    public function test_administrator_can_update_and_delete_a_customer(): void
    {
        $admin = $this->userWithRole('Administrator');
        $customer = Customer::factory()->create(['company_name' => 'Old Name']);

        $update = $this->actingAs($admin)->putJson("/api/customers/{$customer->id}", [
            'company_name' => 'New Name',
        ]);
        $update->assertOk();
        $update->assertJsonPath('data.company_name', 'New Name');

        $delete = $this->actingAs($admin)->deleteJson("/api/customers/{$customer->id}");
        $delete->assertOk();
        $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/customers');

        $response->assertUnauthorized();
    }
}
