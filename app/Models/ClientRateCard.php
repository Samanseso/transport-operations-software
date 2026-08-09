<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientRateCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'service_type',
        'base_rate_cents',
        'per_km_rate_cents',
        'volume_discount_pct',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id', 'id');
    }
}
