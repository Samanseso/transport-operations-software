<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\Reservation;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\SystemLog;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FleetController extends Controller
{
    public function index(Request $request)
    {
        $allDrivers = Driver::orderBy('name', 'asc')->get();
        $recentVehicleLogs = SystemLog::where('module', 'VEHICLES')
            ->orderBy('datelog', 'desc')
            ->orderBy('timelog', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('admin/fleet-management', [
            'vehicles' => Vehicle::with('driver')->get(),
            'availableDrivers' => $allDrivers,
            'recentVehicleLogs' => $recentVehicleLogs,
        ]);
    }

    public function show($vehicle_id)
    {
        $allDrivers = Driver::orderBy('name', 'asc')->get();

        $vehicle_reservations = Reservation::whereIn('reservation_id', Dispatch::where("vehicle_id", $vehicle_id)
        ->pluck('reservation_id'))
        ->with('dispatch')
        ->orderBy(
            Dispatch::select('schedule')
                ->whereColumn('reservations.reservation_id', 'dispatches.reservation_id')
                    ->limit(1),
                'desc'
            )
        ->get();

        return Inertia::render('admin/fleet-details', [
            'vehicles' => Vehicle::with('driver')->get(),
            'selectedVehicle' => Vehicle::with('driver')->where('vehicle_id', $vehicle_id)->firstOrFail(),
            'reservations' => $vehicle_reservations,
            'availableDrivers' => $allDrivers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => ['required', 'string', 'max:255'],
            'vin_number' => ['nullable', 'string', 'max:100', 'unique:vehicles,vin_number'],
            'model' => ['required', 'string', 'max:255'],
            'capacity' => ['nullable', 'string', 'max:255'],
            'registration_expires_at' => ['nullable', 'date'],
            'insurance_expires_at' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(['AVAILABLE', 'IN_USE', 'IN_MAINTENANCE', 'UNSAFE_FOR_DRIVE'])],
            'driver_id' => ['nullable', 'string', 'max:255', 'exists:drivers,driver_id'],
        ]);

        Vehicle::create([
            'vehicle_id' => (string) Str::orderedUuid(),
            'driver_id' => $validated['driver_id'] ?? null,
            'plate_number' => $validated['plate_number'],
            'vin_number' => $validated['vin_number'] ?? null,
            'model' => $validated['model'],
            'capacity' => $validated['capacity'] ?? null,
            'registration_expires_at' => $validated['registration_expires_at'] ?? null,
            'insurance_expires_at' => $validated['insurance_expires_at'] ?? null,
            'status' => $validated['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (! empty($validated['driver_id'])) {
            Driver::where('driver_id', $validated['driver_id'])->update([
                'status' => 'ASSIGNED',
                'updated_at' => now(),
            ]);
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'VEHICLES',
            'performed_to' => $validated['plate_number'],
            'description' => 'Vehicle '.$validated['plate_number'].' registered in fleet catalog.',
        ]);

        return redirect()->route('fleet.index');
    }

    public function update(Request $request, $vehicle_id)
    {
        $vehicle = Vehicle::where('vehicle_id', $vehicle_id)->firstOrFail();

        $validated = $request->validate([
            'plate_number' => ['required', 'string', 'max:255'],
            'vin_number' => ['nullable', 'string', 'max:100', Rule::unique('vehicles', 'vin_number')->ignore($vehicle->vehicle_id, 'vehicle_id')],
            'model' => ['required', 'string', 'max:255'],
            'capacity' => ['nullable', 'string', 'max:255'],
            'registration_expires_at' => ['nullable', 'date'],
            'insurance_expires_at' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(['AVAILABLE', 'IN_USE', 'IN_MAINTENANCE', 'UNSAFE_FOR_DRIVE'])],
            'driver_id' => ['nullable', 'string', 'max:255', 'exists:drivers,driver_id'],
        ]);

        $vehicle->update([
            'plate_number' => $validated['plate_number'],
            'vin_number' => $validated['vin_number'] ?? null,
            'model' => $validated['model'],
            'capacity' => $validated['capacity'] ?? null,
            'registration_expires_at' => $validated['registration_expires_at'] ?? null,
            'insurance_expires_at' => $validated['insurance_expires_at'] ?? null,
            'status' => $validated['status'],
            'driver_id' => $validated['driver_id'] ?? null,
            'updated_at' => now(),
        ]);

        if (! empty($validated['driver_id'])) {
            Driver::where('driver_id', $validated['driver_id'])->update([
                'status' => 'ASSIGNED',
                'updated_at' => now(),
            ]);
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'VEHICLES',
            'performed_to' => $validated['plate_number'],
            'description' => 'Vehicle '.$validated['plate_number'].' configuration updated.',
        ]);

        return redirect()->route('fleet.show', $vehicle_id);
    }
}
