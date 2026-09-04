<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->first();
        $admin = User::where('email', 'admin@aio-mauzo.local')->first();

        $customers = [
            ['company_name' => 'Serengeti Traders Ltd', 'contact_person' => 'Amina Hassan', 'city' => 'Dar es Salaam', 'country' => 'Tanzania'],
            ['company_name' => 'Kilimanjaro Freight Co.', 'contact_person' => 'John Mushi', 'city' => 'Arusha', 'country' => 'Tanzania'],
            ['company_name' => 'Zanzibar Spice Exports', 'contact_person' => 'Fatma Suleiman', 'city' => 'Zanzibar City', 'country' => 'Tanzania'],
            ['company_name' => 'Mwanza Fisheries Group', 'contact_person' => 'Peter Nyerere', 'city' => 'Mwanza', 'country' => 'Tanzania'],
            ['company_name' => 'Dodoma Agri Supplies', 'contact_person' => 'Grace Mollel', 'city' => 'Dodoma', 'country' => 'Tanzania'],
            ['company_name' => 'Coastal Logistics Ltd', 'contact_person' => 'Ibrahim Kassim', 'city' => 'Tanga', 'country' => 'Tanzania'],
        ];

        foreach ($customers as $data) {
            Customer::firstOrCreate(
                ['company_name' => $data['company_name']],
                [
                    ...$data,
                    'company_id' => $company?->id,
                    'phone' => '+255 7'.random_int(10000000, 99999999),
                    'email' => strtolower(str_replace(' ', '.', $data['company_name'])).'@example.com',
                    'tin' => (string) random_int(100000000, 999999999),
                    'is_active' => true,
                    'created_by' => $admin?->id,
                ]
            );
        }
    }
}
