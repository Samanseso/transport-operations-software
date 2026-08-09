<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverExpense extends Model
{
    use HasFactory;

    protected $table = 'driver_expenses';

    protected $primaryKey = 'expense_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'expense_id',
        'driver_id',
        'category',
        'amount',
        'amount_cents',
        'description',
        'receipt_url',
        'status',
        'created_at',
        'updated_at',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'driver_id');
    }
}
