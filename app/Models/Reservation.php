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

    const STATUS_PENDING = 'PENDING';
    const STATUS_ASSIGNED = 'ASSIGNED';
    const STATUS_DRIVER_EN_ROUTE_TO_PICKUP = 'DRIVER_EN_ROUTE_TO_PICKUP';
    const STATUS_ARRIVED_AT_PICKUP = 'ARRIVED_AT_PICKUP';
    const STATUS_CARGO_LOADED = 'CARGO_LOADED';
    const STATUS_IN_TRANSIT = 'IN_TRANSIT';
    const STATUS_ARRIVED_AT_DROPOFF = 'ARRIVED_AT_DROPOFF';
    const STATUS_DELIVERED = 'DELIVERED';
    const STATUS_PARTIAL_DELIVERY = 'PARTIAL_DELIVERY';
    const STATUS_FAILED_DROPOFF = 'FAILED_DROPOFF';
    const STATUS_CANCELLED = 'CANCELLED';

    public static function getActiveStatuses(): array
    {
        return [
            self::STATUS_ASSIGNED,
            self::STATUS_DRIVER_EN_ROUTE_TO_PICKUP,
            self::STATUS_ARRIVED_AT_PICKUP,
            self::STATUS_CARGO_LOADED,
            self::STATUS_IN_TRANSIT,
            self::STATUS_ARRIVED_AT_DROPOFF,
            'EN ROUTE',
            'GOING TO PICKUP',
            'GOING TO DROPOFF',
            'WAITING',
        ];
    }

    protected $fillable = [
        'reservation_id',
        'waybill_number',
        'status',
        'customer_id',    
        'pickup_address',
        'pickup_latlng',
        'dropoff_address',
        'dropoff_latlng',
        'waypoints',
        'date',
        'time',
        'service_type',
        'cargo_details',
        'cargo_type',
        'cargo_weight_kg',
        'max_capacity_kg',
        'special_instructions',
        'total_fare_cents',
        'base_rate_applied_cents',
        'per_km_rate_applied_cents',
        'per_min_rate_applied_cents',
        'multi_stop_surcharge_cents',
        'pod_signature_url',
        'pod_photo_url',
        'pod_recipient_name',
        'pod_signed_at',
    ];

    protected $casts = [
        'waypoints' => 'array',
        'pod_signed_at' => 'datetime',
    ];

    public static function generateWaybillNumber(): string
    {
        do {
            $waybill = 'MA-' . date('Y') . '-' . strtoupper(\Illuminate\Support\Str::random(6));
        } while (static::where('waybill_number', $waybill)->exists());

        return $waybill;
    }

    public function getTotalFareFormattedAttribute(): string
    {
        return '₱' . number_format(($this->total_fare_cents ?? 0) / 100, 2);
    }

    public $timestamps = true;

    public function dispatch()
    {
        return $this->hasOne(Dispatch::class, 'reservation_id', 'reservation_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id', 'id');
    }
}
