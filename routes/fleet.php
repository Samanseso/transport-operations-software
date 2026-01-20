<?php

use App\Http\Controllers\FleetController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    Route::redirect("fleet", "fleet/overview");

    Route::get('fleet/overview', [FleetController::class, 'index'])->name('fleet.index');
    
    Route::get('fleet/{vehicle_id}', [FleetController::class, 'show'])->name('fleet.show');
});
