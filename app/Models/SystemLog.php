<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    protected $table = 'logs';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'datelog',
        'timelog',
        'action',
        'module',
        'performed_to',
        'description',
    ];
}
