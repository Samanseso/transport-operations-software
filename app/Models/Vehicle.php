<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vehicles'; // adjust if your table name differs

    protected $primaryKey = 'vehicle_id';   // if reservation_id is your PK

    public $incrementing = false;               // since reservation_id is a string
    protected $keyType = 'string';

    const STATUS_AVAILABLE = 'AVAILABLE';
    const STATUS_IN_USE = 'IN_USE';
    const STATUS_IN_MAINTENANCE = 'IN_MAINTENANCE';
    const STATUS_UNSAFE_FOR_DRIVE = 'UNSAFE_FOR_DRIVE';

    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'plate_number',
        'vin_number',
        'model',
        'capacity',
        'registration_expires_at',
        'insurance_expires_at',
        'last_serviced_odometer',
        'status',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'registration_expires_at' => 'date',
        'insurance_expires_at' => 'date',
        'last_serviced_odometer' => 'integer',
    ];

    public $timestamps = false;

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'driver_id');
    }

    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class, 'vehicle_id', 'vehicle_id');
    }
}
