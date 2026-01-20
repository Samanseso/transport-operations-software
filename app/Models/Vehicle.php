<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'vehicles'; // adjust if your table name differs

    protected $primaryKey = 'vehicle_id';   // if reservation_id is your PK

    public $incrementing = false;               // since reservation_id is a string
    protected $keyType = 'string';

    protected $fillable = [
        'vehicle_id',
        'drived_by',
        'plate_number',
        'model',
        'capacity',
        'status',
        'created_at',
        'updated_at',
    ];

    public $timestamps = false;

    public function driver()
    {
        return $this->hasOne(Driver::class, 'driver_id', 'driver_id');
    }

    public function dispatch()
    {
        return $this->belongsTo(Dispatch::class, 'vehicle_id', 'vehicle_id');
    }
}
