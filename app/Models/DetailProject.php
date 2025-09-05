<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailProject extends Model
{
    protected $table = 'detail_project';
    protected $primaryKey = 'id_detail_project';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class, 'id_project', 'id_project');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }
}
