<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hub extends Model
{
    use HasFactory;

    protected $fillable = [
        'hub_code',
        'name',
        'type',
        'address',
        'latlng',
        'manager_name',
    ];

    public function outboundManifests()
    {
        return $this->hasMany(Manifest::class, 'origin_hub_id');
    }

    public function inboundManifests()
    {
        return $this->hasMany(Manifest::class, 'destination_hub_id');
    }

    public function scans()
    {
        return $this->hasMany(HubScan::class, 'hub_id');
    }
}
