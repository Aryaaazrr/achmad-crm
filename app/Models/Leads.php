<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Leads extends Model
{
    protected $table = 'leads';
    protected $primaryKey = 'id_leads';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function project()
    {
        return $this->hasOne(Project::class, 'id_lead', 'id_leads');
    }

    // public function customer()
    // {
    //     return $this->hasOne(Customer::class, 'id_leads', 'id_leads');
    // }
}
