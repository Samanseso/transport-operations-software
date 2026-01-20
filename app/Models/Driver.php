<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Driver extends Model
{
    use HasFactory;

    protected $table = 'drivers'; // adjust if your table name differs

    protected $primaryKey = 'driver_id';   // if reservation_id is your PK

    public $incrementing = false;               // since reservation_id is a string
    protected $keyType = 'string';

    protected $fillable = [
        'driver_id',
        'name',
        'contact_number',
        'license_number',
        'status',
    ];

    public $timestamps = true;

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }
}
