<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manifest extends Model
{
    use HasFactory;

    protected $fillable = [
        'manifest_code',
        'origin_hub_id',
        'destination_hub_id',
        'vehicle_id',
        'driver_id',
        'status',
        'waybills',
        'dispatched_at',
        'arrived_at',
    ];

    protected $casts = [
        'waybills' => 'array',
        'dispatched_at' => 'datetime',
        'arrived_at' => 'datetime',
    ];

    public function originHub()
    {
        return $this->belongsTo(Hub::class, 'origin_hub_id');
    }

    public function destinationHub()
    {
        return $this->belongsTo(Hub::class, 'destination_hub_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }
}
