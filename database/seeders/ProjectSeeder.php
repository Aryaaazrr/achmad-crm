<?php

namespace Database\Seeders;

use App\Models\Leads;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = Leads::where('status', 'deal')->get();
        $statuses = ['waiting', 'approved', 'rejected'];
        $products = Product::all();

        if ($leads->isEmpty()) {
            $this->command->warn('Tidak ada lead dengan status "deal", project tidak dibuat.');
            return;
        }

        foreach ($leads as $lead) {
            $salesId = $lead->id_user;

            $project = Project::create([
                'id_lead' => $lead->id_leads,
                'id_user' => $salesId,
                'status'  => $statuses[array_rand($statuses)],
                'total_price' => 0,
            ]);

            $selectedProducts = $products->random(rand(1, 3));
            $totalPrice = 0;

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 5);
                $price = $product->hpp * (1 + rand(10, 50)/100);
                $totalPrice += $quantity * $price;

                DB::table('detail_project')->insert([
                    'id_project' => $project->id_project,
                    'id_product' => $product->id_product,
                    'quantity'   => $quantity,
                    'price'      => $price,
                ]);
            }

            $project->update(['total_price' => $totalPrice]);
        }
    }
}
