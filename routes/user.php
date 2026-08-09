<?php

use App\Http\Controllers\ActiveDispatchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth:sanctum', 'role:ADMINISTRATOR,DISPATCHER'])->group(function () {

    Route::redirect('users', 'users/customer');

    Route::get('users/customer', [UserController::class, 'customer'])->name('user.customer');
    Route::get('users/driver', [UserController::class, 'driver'])->name('user.driver');
    Route::get('users/admin', [UserController::class, 'admin'])->name('user.admin');

    Route::get('users/{user}', [UserController::class, 'show'])->name('user.show');

    Route::post('users/create', [UserController::class, 'create'])->name('users.create');
    Route::patch('users/update/{user}', [UserController::class, 'update'])->name('users.update');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});
