<?php

use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('reservations/create/select', '/reservations/create/select/today');

    
    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations.index');

    Route::get('reservations/{reservation_id}', [ReservationController::class, 'retrieve'])->name('reservations.retrieve');
    Route::delete('/reservations/{reservation_id}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

    Route::get('/reservations/create/step/{step}', [ReservationController::class, 'step'])->name('reservations.step');
    Route::patch('reservations/create/processStep1', [ReservationController::class, 'processStep1'])->name('reservations.processStep1');
    Route::patch('reservations/create/processStep2', [ReservationController::class, 'processStep2'])->name('reservations.processStep2');
    Route::patch('reservations/create/processStep3', [ReservationController::class, 'processStep3'])->name('reservations.processStep3');
    Route::patch('reservations/create/processStep4', [ReservationController::class, 'processStep4'])->name('reservations.processStep4');
    Route::patch('reservations/create/processStep5', [ReservationController::class, 'processStep5'])->name('reservations.processStep5');

});
