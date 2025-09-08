<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            ProductSeeder::class
        ]);

        $fakeSales = User::factory(10)->create();
        $fakeSales->each(function ($user) {
            $user->assignRole(User::ROLE_SALES);
        });

        $manager = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
        ]);

        $manager->assignRole(User::ROLE_MANAGER);

        $sales = User::factory()->create([
            'name' => 'Sales',
            'email' => 'sales@example.com',
        ]);

        $sales->assignRole(User::ROLE_SALES);

        $this->call([
            LeadsSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
