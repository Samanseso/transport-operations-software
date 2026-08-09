<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pricing extends Model
{
    use HasFactory;

    protected $table = 'pricing';

    protected $primaryKey = 'pricing_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'pricing_id',
        'service_type',
        'base_rate',
        'distance_rate',
        'travel_time_rate',
        'base_rate_cents',
        'distance_rate_cents',
        'travel_time_rate_cents',
    ];
}
