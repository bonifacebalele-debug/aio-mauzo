<?php

namespace Database\Seeders;

use App\Models\Tax;
use Illuminate\Database\Seeder;

class TaxSeeder extends Seeder
{
    public function run(): void
    {
        $taxes = [
            ['name' => 'VAT 18%', 'rate' => 18, 'is_default' => true],
            ['name' => 'No Tax', 'rate' => 0, 'is_default' => false],
        ];

        foreach ($taxes as $tax) {
            Tax::firstOrCreate(['name' => $tax['name']], $tax);
        }
    }
}
