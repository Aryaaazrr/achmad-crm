<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'product';
    protected $primaryKey = 'id_product';
    protected $guarded = [];

    public function detail_project()
    {
        return $this->hasMany(DetailProject::class, 'id_product', 'id_product');
    }

    public static function booted()
    {
        static::saving(function ($product) {
            $product->price = $product->hpp + ($product->hpp * $product->margin / 100);
        });
    }
}
