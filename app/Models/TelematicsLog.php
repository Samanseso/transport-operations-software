<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelematicsLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'fuel_rate_l_100km',
        'engine_temp_c',
        'idle_seconds',
        'harsh_braking_events',
        'dtc_fault_codes',
        'recorded_at',
    ];

    protected $casts = [
        'dtc_fault_codes' => 'array',
        'recorded_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }
}
