<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'project';
    protected $primaryKey = 'id_project';
    protected $guarded = [];

    public function lead()
    {
        return $this->belongsTo(Leads::class, 'id_lead', 'id_leads');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function detail_project()
    {
        return $this->hasMany(DetailProject::class, 'id_project', 'id_project');
    }

    // protected static function booted()
    // {
    //     static::created(function ($project) {
    //         if ($project->isDirty('status') && $project->status === 'approved') {
    //             $exists = Customer::where('id_leads', $project->id_lead)->exists();

    //             if (!$exists) {
    //                 Customer::create([
    //                     'id_leads' => $project->id_lead,
    //                     'status' => 'active',
    //                 ]);
    //             }
    //         }
    //     });
    //     static::updated(function ($project) {
    //         if ($project->isDirty('status') && $project->status === 'approved') {
    //             $exists = Customer::where('id_leads', $project->id_lead)->exists();

    //             if (!$exists) {
    //                 Customer::create([
    //                     'id_leads' => $project->id_lead,
    //                     'status' => 'active',
    //                 ]);
    //             }
    //         }
    //     });
    // }
}
