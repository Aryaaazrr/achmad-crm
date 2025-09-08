<?php

namespace App\Exports;

use App\Models\Project;
use Maatwebsite\Excel\Concerns\FromCollection;

class ProjectReportExport implements FromCollection
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $query = Project::with('lead', 'detail_project');

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('created_at', [$this->startDate, $this->endDate]);
        }

        return $query->get()->map(function($project) {
            return [
                'Project ID' => $project->id_project,
                'Customer Name' => $project->lead->name ?? '-',
                'Status' => $project->status,
                'Total Price' => $project->total_price,
                'Created At' => $project->created_at->format('Y-m-d'),
            ];
        });
    }

    public function headings(): array
    {
        return ['Project ID', 'Customer Name', 'Status', 'Total Price', 'Created At'];
    }
}
