<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodRemittance extends Model
{
    use HasFactory;

    protected $fillable = [
        'remittance_code',
        'driver_id',
        'waybill_number',
        'amount_cents',
        'status',
        'remitted_at',
    ];

    protected $casts = [
        'remitted_at' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'waybill_number', 'waybill_number');
    }
}
