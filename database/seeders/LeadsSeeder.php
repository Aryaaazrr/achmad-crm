<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $salesUsers = User::role('sales')->pluck('id')->toArray();

        if (empty($salesUsers)) {
            $this->command->warn('Tidak ada user dengan role sales, leads tidak dibuat.');
            return;
        }

        $statuses = ['new', 'contacted', 'negotiation', 'deal', 'cancel'];

        for ($i = 1; $i <= 50; $i++) {
            DB::table('leads')->insert([
                'id_user'    => $salesUsers[array_rand($salesUsers)],
                'name'       => 'Lead ' . $i,
                'contact'    => '0812' . rand(10000000, 99999999),
                'address'    => 'Alamat Jalan No. ' . $i,
                'needs'       => 'Kebutuhan produk/software ',
                'status'     => $statuses[array_rand($statuses)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}