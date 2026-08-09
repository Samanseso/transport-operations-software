<?php

use App\Http\Controllers\MyActiveReservationsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth:sanctum', 'role:CUSTOMER'])->group(function () {

    Route::get('my-active-reservations', [MyActiveReservationsController::class, 'index'])->name('my-active-reservations.index');
    Route::get('my-active-reservations/{selectedReservation}', [MyActiveReservationsController::class, 'show'])->name('my-active-reservations.show');
});
