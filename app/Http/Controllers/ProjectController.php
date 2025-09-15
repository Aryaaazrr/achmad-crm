<?php

namespace App\Http\Controllers;

use App\Models\DetailProject;
use App\Models\Leads;
use App\Models\Product;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()->hasRole('sales')) {
            $project = Project::with(['user:id,name', 'lead:id_leads,name'])->where('id_user', Auth::id())->latest()->get();
        } else {
            $project = Project::with(['user:id,name', 'lead:id_leads,name'])->latest()->get();
        }

        return Inertia::render('project/index', ['project' => $project]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $leads = Leads::with('project')->where('id_user', Auth::id())->where('status', 'negotiation')->whereDoesntHave('project')->get();
        $products = Product::all();

        return Inertia::render('project/create', ['leads' => $leads, 'products' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_lead' => 'required|exists:leads,id_leads',
            'products' => 'required|array|min:1',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ]);

        $products = array_filter($request->products, fn($p) => !is_null($p));

        $productIds = array_map(fn($p) => $p['id_product'], $products);
        $validProductIds = Product::whereIn('id_product', $productIds)->pluck('id_product')->toArray();

        if (count($productIds) !== count($validProductIds)) {
            return back()->with('error', 'One or more products are invalid.');
        }

        $totalPrice = 0;
        $status = 'approved';

        foreach ($products as $productData) {
            $product = Product::find($productData['id_product']);

            $subtotal = $productData['quantity'] * $productData['price'];
            $totalPrice += $subtotal;

            if ($productData['price'] < $product->price) {
                $status = 'waiting';
            }
        }

        try {
            DB::beginTransaction();

            $project = Project::create([
                'id_lead' => $request->id_lead,
                'id_user' => Auth::id(),
                'status' => $status,
                'total_price' => $totalPrice,
            ]);

            foreach ($products  as $productData) {
                DetailProject::create([
                    'id_project' => $project->id_project,
                    'id_product' => $productData['id_product'],
                    'quantity' => $productData['quantity'],
                    'price' => $productData['price'],
                    'subtotal' => $productData['quantity'] * $productData['price'],
                ]);
            }

            DB::commit();

            return redirect()->route('project.index')
                ->with('success', "Project created successfully with status: {$status}");

        } catch (\Exception $e) {
            DB::rollback();

            return back()->with('error', 'Failed to create project. Please try again.')
                        ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::with('detail_project')->findOrFail($id);
        if (Auth::user()->hasRole('sales')) {
            $leads = Leads::where('id_user', Auth::id())
                ->get();
        } else {
            $leads = Leads::get();
        }

        $products = Product::all();

        $detailProducts = ($project->detail_project ?? collect())->mapWithKeys(function($item) {
            return [
                $item->id_product => [
                    'quantity' => (int) $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ]
            ];
        })->toArray();

        return Inertia::render('project/show', [
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
        $project = Project::with('detail_project')->findOrFail($id);
         if (Auth::user()->hasRole('sales')) {
            $leads = Leads::where('id_user', Auth::id())
                ->get();
        } else {
            $leads = Leads::get();
        }

        $products = Product::all();

        $detailProducts = ($project->detail_project ?? collect())->mapWithKeys(function($item) {
            return [
                $item->id_product => [
                    'quantity' => (int) $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                ]
            ];
        })->toArray();

        return Inertia::render('project/edit', [
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'id_lead' => 'required|exists:leads,id_leads',
            'products' => 'required|array|min:1',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'status' => 'nullable|in:waiting,approved,rejected',
        ]);

        $products = array_filter($request->products, fn($p) => !is_null($p));

        $productIds = array_map(fn($p) => $p['id_product'], $products);
        $validProductIds = Product::whereIn('id_product', $productIds)->pluck('id_product')->toArray();

        if (count($productIds) !== count($validProductIds)) {
            return back()->with('error', 'One or more products are invalid.');
        }

        $totalPrice = 0;
        $status = 'approved';

        foreach ($products as $productData) {
            $product = Product::find($productData['id_product']);

            $subtotal = $productData['quantity'] * $productData['price'];
            $totalPrice += $subtotal;

            if ($productData['price'] < $product->price) {
                $status = 'waiting';
            }
        }

        try {
            DB::beginTransaction();

            $project = Project::findOrFail($id);

            if (Auth::user()->hasRole('manager')) {
                $status = $request->status;
            }

            $project->update([
                'id_lead' => $request->id_lead,
                'status' => $status,
                'total_price' => $totalPrice,
            ]);

            DetailProject::where('id_project', $project->id_project)->delete();

            foreach ($products as $productData) {
                DetailProject::create([
                    'id_project' => $project->id_project,
                    'id_product' => $productData['id_product'],
                    'quantity' => $productData['quantity'],
                    'price' => $productData['price'],
                    'subtotal' => $productData['quantity'] * $productData['price'],
                ]);
            }

            DB::commit();

            return redirect()->route('project.index')
                ->with('success', "Project updated successfully with status: {$status}");

        } catch (\Exception $e) {
            DB::rollback();

            return back()->with('error', 'Failed to update project. Please try again.')
                        ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return redirect()
            ->route('project.index')
            ->with('success', 'Project has been deleted permanent successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            Project::whereIn('id_project', $ids)->delete();
        }

        return back()->with('success', count($ids) . ' Project deleted permanent successfully.');
    }
}
