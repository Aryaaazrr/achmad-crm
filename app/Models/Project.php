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

    protected static function booted()
    {
        static::created(function ($project) {
            if ($project->status === 'approved') {
                $lead = $project->lead;

                if ($lead && !$lead->customer) {
                    Customer::create([
                        'id_leads'      => $lead->id_leads,
                        'customer_name' => $lead->name,
                        'contact'       => $lead->contact,
                        'address'       => $lead->address,
                        'status'        => 'active',
                    ]);

                    $lead->update(['status' => 'deal']);
                }
            }
        });

        static::updated(function ($project) {
            $lead = $project->lead;

            if (!$lead) return;

            if ($project->isDirty('status') && $project->status === 'approved') {
                if (!$lead->customer) {
                    Customer::create([
                        'id_leads'      => $lead->id_leads,
                        'customer_name' => $lead->name,
                        'contact'       => $lead->contact,
                        'address'       => $lead->address,
                        'status'        => 'active',
                    ]);
                }

                $lead->update(['status' => 'deal']);
            }

            if ($project->isDirty('status') && $project->status !== 'approved') {
                if ($lead->customer) {
                    $lead->customer->delete();
                }
                if ($project->status === 'waiting') {
                    $lead->update(['status' => 'negotiation']);
                } else {
                    $lead->update(['status' => 'cancel']);
                }
            }
        });

        static::deleted(function ($project) {
            $lead = $project->lead;

            if ($lead) {
                $lead->update(['status' => 'negotiation']);

                if ($lead->customer) {
                    $lead->customer->delete();
                }
            }
        });
    }
}