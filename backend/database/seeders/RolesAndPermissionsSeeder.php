<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    private const array PERMISSIONS = [
        'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
        'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.manage_status',
        'settings.view', 'settings.edit',
        'reports.view',
        'users.view', 'users.manage',
    ];

    private const array ROLE_PERMISSIONS = [
        'Administrator' => self::PERMISSIONS,
        'Manager' => [
            'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
            'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.manage_status',
            'reports.view', 'settings.view', 'users.view',
        ],
        'Sales' => [
            'customers.view', 'customers.create', 'customers.edit',
            'invoices.view', 'invoices.create', 'invoices.edit',
        ],
        'Accountant' => [
            'customers.view',
            'invoices.view', 'invoices.manage_status',
            'reports.view', 'settings.view',
        ],
        'Viewer' => [
            'customers.view', 'invoices.view', 'reports.view',
        ],
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($permissions);
        }
    }
}
