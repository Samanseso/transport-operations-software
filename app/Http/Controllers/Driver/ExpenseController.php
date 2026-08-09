<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\DriverExpense;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $driver = Driver::where('name', $user->name)->first();
        $driverId = $driver ? $driver->driver_id : $user->id;

        $expenses = DriverExpense::where('driver_id', (string) $driverId)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('driver/expenses', [
            'driver' => $driver,
            'expenses' => $expenses,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $driver = Driver::where('name', $user->name)->first();
        $driverId = $driver ? $driver->driver_id : (string) $user->id;

        $validated = $request->validate([
            'category' => ['required', 'string', 'max:50'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string'],
            'receipt_url' => ['nullable', 'string'],
        ]);

        DriverExpense::create([
            'expense_id' => (string) Str::orderedUuid(),
            'driver_id' => (string) $driverId,
            'category' => $validated['category'],
            'amount' => $validated['amount'],
            'amount_cents' => (int) round(((float) $validated['amount']) * 100),
            'description' => $validated['description'] ?? null,
            'receipt_url' => $validated['receipt_url'] ?? null,
            'status' => 'PENDING',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'EXPENSE',
            'performed_to' => (string) $driverId,
            'description' => 'Driver logged '.$validated['category'].' expense of ₱'.$validated['amount'],
        ]);

        return back();
    }
}
