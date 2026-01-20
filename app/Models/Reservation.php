<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations'; // adjust if your table name differs

    protected $primaryKey = 'reservation_id';   // if reservation_id is your PK

    public $incrementing = false;               // since reservation_id is a string
    protected $keyType = 'string';

    protected $fillable = [
        'reservation_id',
        'status',
        'customer_name',    
        'email',
        'contact',
        'pickup_address',
        'pickup_latlng',
        'dropoff_address',
        'dropoff_latlng',
        'date',
        'time',
        'service_type',
        'cargo_details',
        'special_instructions',
    ];

    public $timestamps = true;

    public function dispatch()
    {
        return $this->hasOne(Dispatch::class, 'reservation_id', 'reservation_id');
    }
}
