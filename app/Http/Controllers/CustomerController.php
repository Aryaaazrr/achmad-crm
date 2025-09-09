<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Leads;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        if (Auth::user()->hasRole('sales')) {
            $customer = Customer::whereHas('lead', function ($query) use ($userId) {
                $query->where('id_user', $userId);
                    })->with('lead.user')
                ->latest()
                ->get();
        } else {
            $customer = Customer::with(['lead.user'])->latest()->get();
        }

        return Inertia::render('customer/index', ['customer' => $customer]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::findOrFail($id);

        $project = Project::with('detail_project')->where('id_lead', $customer->id_leads)->firstOrFail();

        $leads = Leads::where('status', 'deal')
            ->get();

        $products = Product::all();

        $detailProducts = ($project->detail_project ?? collect())->mapWithKeys(function ($item) {
            return [
                $item->id_product => [
                    'quantity' => (int) $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ]
            ];
        })->toArray();

        return Inertia::render('customer/show', [
            'customer' => $customer,
            'project' => [
                'id_project' => $project->id_project,
                'id_lead' => $project->id_lead,
                'total_price' => (float) $project->total_price,
                'status' => $project->status,
            ],
            'leads' => $leads,
            'products' => $products,
            'detailProducts' => $detailProducts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
