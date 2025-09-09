<?php

namespace Database\Seeders;

use App\Models\Leads;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = Leads::where('status', 'negotiation')->get();
        $products = Product::all();

        foreach ($leads as $lead) {
            $salesId = $lead->id_user;

            $project = Project::create([
                'id_lead' => $lead->id_leads,
                'id_user' => $salesId,
                'status'  => 'waiting',
                'total_price' => 0,
            ]);

            $selectedProducts = $products->random(rand(1, 3));
            $totalPrice = 0;
            $needApproval = false;

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 5);
                $price = $product->hpp + ($product->hpp * rand(1, 25)/100);
                $totalPrice += $quantity * $price;

                DB::table('detail_project')->insert([
                    'id_project' => $project->id_project,
                    'id_product' => $product->id_product,
                    'quantity'   => $quantity,
                    'price'      => $price,
                    'subtotal'   => $price * $quantity,
                ]);

                if ($price < $product->price) {
                    $needApproval = true;
                }
            }

            $project->update(['total_price' => $totalPrice]);

            if (! $needApproval) {
                $lead->update(['status' => 'deal']);
                $project->update(['status' => 'approved']);
            }
        }
    }
}
