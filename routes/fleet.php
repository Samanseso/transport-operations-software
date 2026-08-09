<?php

use App\Http\Controllers\FleetController;
use App\Http\Controllers\Fleet\MaintenanceController;
use App\Http\Controllers\Fleet\FuelController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {

    Route::redirect("fleet", "fleet/overview");

    Route::get('fleet/overview', [FleetController::class, 'index'])->name('fleet.index');

    Route::get('fleet/maintenance', [MaintenanceController::class, 'index'])->name('fleet.maintenance.index');
    Route::post('fleet/maintenance', [MaintenanceController::class, 'store'])->name('fleet.maintenance.store');
    Route::patch('fleet/maintenance/{id}/status', [MaintenanceController::class, 'updateStatus'])->name('fleet.maintenance.status');

    Route::get('fleet/fuel', [FuelController::class, 'index'])->name('fleet.fuel.index');
    Route::post('fleet/fuel', [FuelController::class, 'store'])->name('fleet.fuel.store');

    Route::get('fleet/{vehicle_id}', [FleetController::class, 'show'])->name('fleet.show');
    Route::post('fleet', [FleetController::class, 'store'])->name('fleet.store');
    Route::patch('fleet/{vehicle_id}', [FleetController::class, 'update'])->name('fleet.update');
});

