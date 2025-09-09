<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customer';
    protected $primaryKey = 'id_customer';
    protected $guarded = [];

    public function lead()
    {
        return $this->belongsTo(Leads::class, 'id_leads', 'id_leads');
    }
}
