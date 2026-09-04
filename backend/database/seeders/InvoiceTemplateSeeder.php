<?php

namespace Database\Seeders;

use App\Models\InvoiceTemplate;
use Illuminate\Database\Seeder;

class InvoiceTemplateSeeder extends Seeder
{
    public function run(): void
    {
        InvoiceTemplate::firstOrCreate(
            ['slug' => 'modern'],
            [
                'name' => 'Modern',
                'is_default' => true,
                'config' => ['layout' => 'modern'],
                'is_active' => true,
            ]
        );
    }
}
