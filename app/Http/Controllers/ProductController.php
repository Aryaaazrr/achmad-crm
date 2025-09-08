<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('product/index', ['product' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('product/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => ['required', 'string', 'min:2', 'max:255'],
            'hpp'             => ['required', 'numeric', 'min:1'],
            'margin'          => ['required', 'numeric', 'min:0.5', 'max:100'],
        ]);

        Product::create([
            'name'     => $validated['name'],
            'hpp'    => $validated['hpp'],
            'margin'    => $validated['margin'],
        ]);

        return redirect()->route('product.index')
                     ->with('success', 'Product has been created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('product/edit', ['product' => $product]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'name'   => 'required|string|max:255',
            'hpp'    => 'required|numeric|min:0',
            'margin' => 'required|numeric|min:0',
        ]);

        $product->update($data);

        return redirect()->route('product.index')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()
            ->route('product.index')
            ->with('success', 'Product has been deleted successfully.');
    }

     public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            Product::whereIn('id_product', $ids)->delete();
        }

        return back()->with('success', count($ids) . ' Product deleted successfully.');
    }

    public function showDeleted()
    {
        $product = Product::onlyTrashed()->get();

        return Inertia::render('product/deleted', ['product' => $product]);
    }

    public function restore($id)
    {
        Product::withTrashed()->find($id)->restore();
        return back()->with('success', 'Product restored successfully.');
    }

    public function forceDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            Product::whereIn('id_product', $ids)->forceDelete();
        }

        return back()->with('success', count($ids) . ' Products has been successfully deleted permanently.');
    }
}
