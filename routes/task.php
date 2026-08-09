<?php

use App\Http\Controllers\Driver\ExpenseController;
use App\Http\Controllers\Driver\InspectionController;
use App\Http\Controllers\Driver\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('tasks', [TaskController::class, 'index'])->name('task.index');
    Route::get('driver/inspection', [InspectionController::class, 'index'])->name('driver.inspection.index');
    Route::post('driver/inspection', [InspectionController::class, 'store'])->name('driver.inspection.store');
    Route::get('driver/expenses', [ExpenseController::class, 'index'])->name('driver.expenses.index');
    Route::post('driver/expenses', [ExpenseController::class, 'store'])->name('driver.expenses.store');

    Route::get('tasks/{reservation_id}', [TaskController::class, 'show'])->name('task.show');
    Route::post('tasks/location', [TaskController::class, 'update'])->name('task.update');
    Route::post('tasks/{reservation_id}/status', [TaskController::class, 'updateStatus'])->name('task.updateStatus');
    Route::post('tasks/{reservation_id}/waypoint/{waypoint_index}/pod', [TaskController::class, 'updateWaypointPod'])->name('task.updateWaypointPod');
});

