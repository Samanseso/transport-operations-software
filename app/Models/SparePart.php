<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SparePart extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'category',
        'stock_quantity',
        'min_threshold',
        'unit_cost_cents',
    ];
}
