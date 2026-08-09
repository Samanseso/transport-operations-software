<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelLog extends Model
{
    use HasFactory;

    protected $table = 'fuel_logs';

    protected $primaryKey = 'fuel_log_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'fuel_log_id',
        'vehicle_id',
        'driver_id',
        'liters',
        'total_cost',
        'total_cost_cents',
        'odometer_reading',
        'efficiency_km_l',
        'is_anomaly',
        'receipt_image_url',
        'filled_at',
        'created_at',
        'updated_at',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'driver_id');
    }
}
