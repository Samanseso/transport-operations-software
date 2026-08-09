<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MaintenanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintenance_id',
        'vehicle_id',
        'service_type',
        'serviced_at',
        'odometer_km',
        'parts_used',
        'total_cost_cents',
        'notes',
    ];

    protected $casts = [
        'parts_used' => 'array',
        'serviced_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->maintenance_id)) {
                $model->maintenance_id = (string) Str::uuid();
            }
        });
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }
}
