<?php

namespace App\Http\Controllers;

use App\Models\Leads;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Auth::user()->hasRole('sales')) {
            $leads = Leads::with(['user:id,name'])->where('id_user', Auth::id())->latest()->get();
        } else {
            $leads = Leads::with(['user:id,name'])->latest()->get();
        }

        return Inertia::render('leads/index', ['leads' => $leads]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('leads/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'contact' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'needs'   => 'nullable|string',
            'status'  => 'required|string|in:new,contacted,negotiation,deal,cancel',
        ]);

        $validated['id_user'] = Auth::id();

        Leads::create($validated);

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead has been created.');
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
        $leads = Leads::findOrFail($id);

        return Inertia::render('leads/edit', ['leads' => $leads]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $lead = Leads::findOrFail($id);

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'contact' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'needs'   => 'nullable|string',
            'status'  => 'required|string|in:new,contacted,negotiation,deal,cancel',
        ]);

        $lead->update($validated);

        return redirect()->route('leads.index')
            ->with('success', 'Lead has been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $leads = Leads::findOrFail($id);
        $leads->delete();

        return redirect()
            ->route('leads.index')
            ->with('success', 'Leads has been deleted permanent successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            Leads::whereIn('id_leads', $ids)->delete();
        }

        return back()->with('success', count($ids) . ' Leads deleted permanent successfully.');
    }
}
