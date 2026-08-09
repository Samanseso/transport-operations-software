<?php

use App\Http\Controllers\MyReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth:sanctum', 'role:CUSTOMER'])->group(function () {

    Route::get('my-reservations', [MyReservationController::class, 'index'])->name('my-reservations.index');

});
