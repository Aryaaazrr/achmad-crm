<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        Role::truncate();
        Permission::truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('role_has_permissions')->truncate();

        $roles = ['manager', 'sales'];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        $salesRole = Role::where(['name' => 'sales'])->first();
        $managerRole = Role::where(['name' => 'manager'])->first();

        $permissions = [
            'users-create', 'users-read', 'users-update', 'users-delete',
            'product-create', 'product-read', 'product-update', 'product-delete',
            'leads-create', 'leads-read', 'leads-update', 'leads-delete',
            'project-create', 'project-read', 'project-update', 'project-delete',
            'customer-read',
            'report-read', 'report-export',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        $salesRole->givePermissionTo([
            'leads-create', 'leads-read', 'leads-update', 'leads-delete',
            'project-create', 'project-read',
            'customer-read', 'report-read',
        ]);

        $managerRole->givePermissionTo([
            'users-create', 'users-read', 'users-update', 'users-delete',
            'product-create', 'product-read', 'product-update', 'product-delete',
            'leads-read', 'leads-update',
            'project-read', 'project-update',
            'customer-read',
            'report-read', 'report-export',
        ]);

        Schema::enableForeignKeyConstraints();
    }
}