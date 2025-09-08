<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paket Internet 50 Mbps',
                'hpp' => 200000,
                'margin' => 25,
            ],
            [
                'name' => 'Paket Internet 100 Mbps',
                'hpp' => 350000,
                'margin' => 20,
            ],
            [
                'name' => 'Paket Internet 200 Mbps',
                'hpp' => 500000,
                'margin' => 15,
            ],
            [
                'name' => 'Paket Internet 1 Gbps',
                'hpp' => 1000000,
                'margin' => 10,
            ],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }
    }
}
