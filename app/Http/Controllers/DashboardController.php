<?php

namespace App\Http\Controllers;

use App\Models\Leads;
use App\Models\Product;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $userId = Auth::id();

            if (Auth::user()->hasRole('sales')) {
                // total leads
                $total_leads = Leads::where('id_user', Auth::id())->count();
                $last_month_leads = Leads::where('id_user', $userId)
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $leads_delta = $this->calculateDelta($total_leads, $last_month_leads);

                // avarage
                $leads_negotiation = Leads::where('id_user', $userId)
                    ->where('status', 'negotiation')
                    ->count();

                $last_month_negotiation = Leads::where('id_user', $userId)
                    ->where('status', 'negotiation')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();

                $negotiation_delta = $this->calculateDelta($leads_negotiation, $last_month_negotiation);

                // Projects data
                $total_project = Project::where('id_user', $userId)->count();
                $last_month_projects = Project::where('id_user', $userId)
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $projects_delta = $this->calculateDelta($total_project, $last_month_projects);

                // Approved projects data
                $project_approved = Project::where('id_user', $userId)
                    ->where('status', 'approved')
                    ->count();

                $last_month_approved = Project::where('id_user', $userId)
                    ->where('status', 'approved')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();

                $approved_delta = $this->calculateDelta($project_approved, $last_month_approved);

                $chartData = $this->getChartData($userId);
                $cardActivity = $this->getCardActivityData($userId);
            } else {
                // total leads
                $total_leads = Leads::count();
                $last_month_leads = Leads::whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $leads_delta = $this->calculateDelta($total_leads, $last_month_leads);

                // negotiation
                $leads_negotiation = Leads::where('status', 'negotiation')
                    ->count();

                $last_month_negotiation = Leads::where('status', 'negotiation')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();

                $negotiation_delta = $this->calculateDelta($leads_negotiation, $last_month_negotiation);

                // Projects data
                $total_project = Project::count();
                $last_month_projects = Project::whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $projects_delta = $this->calculateDelta($total_project, $last_month_projects);

                // Approved projects data
                $project_approved = Project::where('status', 'approved')
                    ->count();

                $last_month_approved = Project::where('status', 'approved')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();

                $approved_delta = $this->calculateDelta($project_approved, $last_month_approved);

                // total product
                $total_product = Product::count();
                $last_month_product = Product::whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $product_delta = $this->calculateDelta($total_product, $last_month_product);

                // top user
                $total_user = User::count();
                $last_month_user = User::whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();
                $user_delta = $this->calculateDelta($total_user, $last_month_user);

                // Revenue
                $total_revenue = Project::where('status', 'approved')
                    ->whereBetween('created_at', [
                        Carbon::now()->startOfMonth(),
                        Carbon::now()->endOfMonth()
                    ])
                    ->sum('total_price');

                $last_month_revenue = Project::where('status', 'approved')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->sum('total_price');

                $revenue_delta = $this->calculateDelta($total_revenue, $last_month_revenue);

                // cancel
                $leads_cancel = Leads::where('status', 'cancel')
                    ->count();

                $last_month_cancel = Leads::where('status', 'cancel')
                    ->whereBetween('created_at', [
                        Carbon::now()->subMonth()->startOfMonth(),
                        Carbon::now()->subMonth()->endOfMonth()
                    ])
                    ->count();

                $cancel_delta = $this->calculateDelta($leads_cancel, $last_month_cancel);

                $chartData = $this->getChartData();
                $cardActivity = $this->getCardActivityData();
            }

             $stats = [
                [
                    'title' => 'Revenue',
                    'value' => (int) $total_revenue,
                    'delta' => $revenue_delta,
                    'lastMonth' => (int) $last_month_revenue,
                    'positive' => $revenue_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Total Leads',
                    'value' => (int) $total_leads,
                    'delta' => $leads_delta,
                    'lastMonth' => (int) $last_month_leads,
                    'positive' => $leads_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Leads Negotiation',
                    'value' => (float) $leads_negotiation,
                    'delta' => $negotiation_delta,
                    'lastMonth' => (float) $last_month_negotiation,
                    'positive' => $negotiation_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Leads Canceled',
                    'value' => (int) $leads_cancel,
                    'delta' => $cancel_delta,
                    'lastMonth' => (int) $last_month_cancel,
                    'positive' => $cancel_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Total Projects',
                    'value' => (int) $total_project,
                    'delta' => $projects_delta,
                    'lastMonth' => (int) $last_month_projects,
                    'positive' => $projects_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Projects Approved',
                    'value' => (int) $project_approved,
                    'delta' => $approved_delta,
                    'lastMonth' => (int) $last_month_approved,
                    'positive' => $approved_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Total Product',
                    'value' => (int) $total_product,
                    'delta' => $product_delta,
                    'lastMonth' => (int) $last_month_product,
                    'positive' => $product_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],
                [
                    'title' => 'Total User',
                    'value' => (float) $total_user,
                    'delta' => $user_delta,
                    'lastMonth' => (float) $last_month_user,
                    'positive' => $user_delta > 0,
                    'prefix' => '',
                    'suffix' => '',
                ],

            ];

            return Inertia::render('dashboard', [
                'stats' => $stats,
                'chartData' => $chartData,
                'cardActivity' => $cardActivity,
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            return Inertia::render('dashboard', [
                'stats' => [],
                'chartData' => $chartData,
                'cardActivity' => $cardActivity,
            ]);
        }
    }

    private function calculateDelta($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function getChartData($userId = null)
    {
        $startDate = Carbon::now()->subDays(90)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $dates = [];
        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }

        $chartData = [];

        foreach ($dates as $date) {
            $dayStart = Carbon::parse($date)->startOfDay();
            $dayEnd = Carbon::parse($date)->endOfDay();

            if ($userId) {
                $leadsCancel = Leads::where('id_user', $userId)
                    ->where('status', 'cancel')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $leadsDeal = Leads::where('id_user', $userId)
                    ->where('status', 'deal')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();
            } else {
                $leadsCancel = Leads::where('status', 'cancel')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count();
                $leadsDeal = Leads::where('status', 'deal')
                    ->whereBetween('created_at', [$dayStart, $dayEnd])->count();
            }

            $chartData[] = [
                'date' => $date,
                'leadsCancel' => $leadsCancel,
                'leadsDeal' => $leadsDeal,
            ];
        }

        return $chartData;
    }

    private function getCardActivityData($userId = null): array
    {
        $dayStart = now()->startOfDay();
        $dayEnd   = now()->endOfDay();
        $weekStart = now()->startOfWeek();
        $weekEnd   = now()->endOfWeek();

        if ($userId) {
            $leadsDealTotal = Leads::where('id_user', $userId)
                ->where('status', 'deal')
                ->count();
        } else {
            $leadsDealTotal = Leads::where('status', 'deal')->count();
        }

        $leadsToday = Leads::where('status', 'deal')
            ->whereBetween('created_at', [$dayStart, $dayEnd])
            ->count();

        $leadsThisWeek = Leads::where('status', 'deal')
            ->whereBetween('created_at', [$weekStart, $weekEnd])
            ->count();

        return [
            'title' => 'Staff Performance',
            'subtitle' => 'Sales Manager',
            'performance' => [
                ['label' => 'Deals Closed', 'value' => $leadsDealTotal, 'trend' => $leadsToday, 'trendDir' => 'up'],
                ['label' => 'This Week', 'value' => $leadsThisWeek, 'trend' => $leadsToday, 'trendDir' => 'up'],
                ['label' => 'Conversion', 'value' => '72%', 'trend' => 3, 'trendDir' => 'down'],
            ],
            'pipelineProgress' => 76,
            'activity' => [
                ['text' => "Closed $leadsToday deal(s) today", 'date' => 'Today', 'state' => 'secondary', 'color' => 'text-green-500'],
                ['text' => "Total $leadsThisWeek deals this week", 'date' => 'This Week', 'state' => 'secondary', 'color' => 'text-green-500'],
                ['text' => 'Follow-up scheduled.', 'date' => 'Upcoming', 'state' => 'destructive', 'color' => 'text-destructive'],
            ],
        ];
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
        //
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
