<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'drivers';

    protected $primaryKey = 'driver_id';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'driver_id',
        'user_id',
        'contact_number',
        'license_number',
        'status',
    ];

    public $timestamps = true;

    protected $appends = ['name', 'email'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function getNameAttribute()
    {
        return $this->user?->name ?? 'Driver ' . $this->driver_id;
    }

    public function getEmailAttribute()
    {
        return $this->user?->email ?? '';
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'driver_id', 'driver_id');
    }
}
