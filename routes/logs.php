<?php

use App\Http\Controllers\SystemLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:ADMINISTRATOR'])->group(function () {
    Route::get('logs', [SystemLogController::class, 'index'])->name('logs.index');
});
