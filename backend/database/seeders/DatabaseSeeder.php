<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            CurrencySeeder::class,
            TaxSeeder::class,
            InvoiceTemplateSeeder::class,
            CompanySeeder::class,
            UserSeeder::class,
            CustomerSeeder::class,
            InvoiceSeeder::class,
        ]);
    }
}
