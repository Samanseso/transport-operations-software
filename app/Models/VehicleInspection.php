<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleInspection extends Model
{
    use HasFactory;

    protected $table = 'vehicle_inspections';

    protected $primaryKey = 'inspection_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'inspection_id',
        'vehicle_id',
        'driver_id',
        'tires_ok',
        'brakes_ok',
        'lights_ok',
        'fuel_level',
        'odometer_reading',
        'defects_noted',
        'photo_url',
        'inspected_at',
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
