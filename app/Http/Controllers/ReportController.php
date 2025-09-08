<?php

namespace App\Http\Controllers;

use App\Exports\ProjectReportExport;
use App\Models\Customer;
use App\Models\Leads;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Excel;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->subMonth());
        $endDate = $request->input('end_date', now());

        $leads = Leads::whereBetween('created_at', [$startDate, $endDate])
            ->with('user')
            ->get();

        $customers = Customer::whereBetween('created_at', [$startDate, $endDate])
            ->with('lead')
            ->get();

        $projects = Project::whereBetween('created_at', [$startDate, $endDate])
            ->with(['lead', 'detail_project.product'])
            ->get();

        return Inertia::render('report/index', [
            'leads' => $leads,
            'customers' => $customers,
            'projects' => $projects,
            'filters' => compact('startDate', 'endDate')
        ]);
    }

    public function export(Request $request)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        return Excel::download(new ProjectReportExport($startDate, $endDate), 'report.xlsx');
    }
}
