<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use HasFactory, SoftDeletes;

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
        return $this->hasOne(Vehicle::class, 'driver_id', 'driver_id');
    }
}
