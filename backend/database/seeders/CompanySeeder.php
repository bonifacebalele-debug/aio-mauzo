<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Currency;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $tzs = Currency::where('code', 'TZS')->first();

        Company::firstOrCreate(
            ['name' => 'AIO Technologies'],
            [
                'primary_color' => '#4F46E5',
                'secondary_color' => '#14B8A6',
                'address' => 'Dar es Salaam, Tanzania',
                'phone' => '+255 700 000 000',
                'email' => 'info@aiotechnologies.co.tz',
                'website' => 'https://aiotechnologies.co.tz',
                'tin' => '100-000-000',
                'vrn' => '40-000000-A',
                'footer_text' => 'Thank you for your business.',
                'terms_conditions' => 'Payment is due within the agreed terms. Late payments may incur additional charges.',
                'payment_instructions' => 'Please make payment to the bank account or mobile money number listed above and share the payment reference.',
                'default_currency_id' => $tzs?->id,
                'default_language' => 'en',
                'invoice_prefix' => 'INV',
                'invoice_number_format' => '{PREFIX}-{YEAR}-{NUMBER}',
                'next_invoice_number' => 1,
                'is_active' => true,
            ]
        );
    }
}
