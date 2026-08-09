<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HubScan extends Model
{
    use HasFactory;

    protected $fillable = [
        'waybill_number',
        'hub_id',
        'scan_type',
        'sorting_bin',
        'scanned_by',
        'scanned_at',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function hub()
    {
        return $this->belongsTo(Hub::class, 'hub_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'waybill_number', 'waybill_number');
    }
}
