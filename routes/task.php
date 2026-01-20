<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Driver\TaskController;

Route::middleware('auth')->group(function () {
    Route::get('tasks', [TaskController::class, 'index'])->name('task.index');
    Route::get('tasks/{reservation_id}', [TaskController::class, 'show'])->name('task.show');
    Route::post('tasks/location', [TaskController::class, 'update'])->name('task.update');
});
