<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'System Administrator', 'email' => 'admin@aio-mauzo.local', 'role' => 'Administrator'],
            ['name' => 'Demo Manager', 'email' => 'manager@aio-mauzo.local', 'role' => 'Manager'],
            ['name' => 'Demo Sales', 'email' => 'sales@aio-mauzo.local', 'role' => 'Sales'],
            ['name' => 'Demo Accountant', 'email' => 'accountant@aio-mauzo.local', 'role' => 'Accountant'],
            ['name' => 'Demo Viewer', 'email' => 'viewer@aio-mauzo.local', 'role' => 'Viewer'],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$userData['role']]);
        }
    }
}
