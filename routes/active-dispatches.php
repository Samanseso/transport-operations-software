<?php

use App\Http\Controllers\ActiveDispatchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    Route::get('active-dispatches', [ActiveDispatchController::class, 'index'])->name('active-dispatches.index');
    Route::get('active-dispatches/{selectedDispatch}', [ActiveDispatchController::class, 'show'])->name('active-dispatches.show');
    
});
