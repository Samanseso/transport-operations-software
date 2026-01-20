<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dispatch extends Model
{
    use HasFactory;

    protected $table = 'dispatches'; // adjust if your table name differs

    protected $primaryKey = 'reservation_id';   // if reservation_id is your PK

    public $incrementing = false;               // since reservation_id is a string
    protected $keyType = 'string';

    protected $fillable = [
        'reservation_id',
        'vehicle_id',
        'schedule',
        'assigned_at',
        'delivered_at',
    ];

    public $timestamps = false;

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'reservation_id');
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'vehicle_id', 'vehicle_id');
    }
}
