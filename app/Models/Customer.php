<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';

    protected $primaryKey = 'customer_id';

    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'user_id',
        'contact_number',
    ];

    protected $appends = ['name', 'email', 'customer_name'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function getNameAttribute()
    {
        return $this->user?->name ?? 'Customer ' . $this->customer_id;
    }

    public function getCustomerNameAttribute()
    {
        return $this->user?->name ?? 'Customer ' . $this->customer_id;
    }

    public function getEmailAttribute()
    {
        return $this->user?->email ?? '';
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'customer_id', 'customer_id');
    }
}
