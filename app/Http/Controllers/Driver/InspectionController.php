<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\SystemLog;
use App\Models\Vehicle;
use App\Models\VehicleInspection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InspectionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $driver = Driver::where('user_id', $user->id)->orWhere('driver_id', $user->role_id)->first();
        $assignedVehicle = $driver ? Vehicle::where('driver_id', $driver->driver_id)->first() : null;
        $recentInspections = VehicleInspection::with(['vehicle', 'driver'])
            ->orderBy('inspected_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('driver/inspection', [
            'driver' => $driver,
            'assignedVehicle' => $assignedVehicle,
            'vehicles' => Vehicle::all(),
            'recentInspections' => $recentInspections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'string', 'exists:vehicles,vehicle_id'],
            'driver_id' => ['required', 'string'],
            'tires_ok' => ['required', 'boolean'],
            'brakes_ok' => ['required', 'boolean'],
            'lights_ok' => ['required', 'boolean'],
            'fuel_level' => ['required', 'string'],
            'odometer_reading' => ['required', 'integer', 'min:0'],
            'defects_noted' => ['nullable', 'string'],
            'photo_url' => ['nullable', 'string'],
        ]);

        $inspection = VehicleInspection::create([
            'inspection_id' => (string) Str::orderedUuid(),
            'vehicle_id' => $validated['vehicle_id'],
            'driver_id' => $validated['driver_id'],
            'tires_ok' => $validated['tires_ok'],
            'brakes_ok' => $validated['brakes_ok'],
            'lights_ok' => $validated['lights_ok'],
            'fuel_level' => $validated['fuel_level'],
            'odometer_reading' => $validated['odometer_reading'],
            'defects_noted' => $validated['defects_noted'] ?? null,
            'photo_url' => $validated['photo_url'] ?? null,
            'inspected_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $vehicle = Vehicle::where('vehicle_id', $validated['vehicle_id'])->first();

        // Safety Hard-Stop: Lock vehicle if critical safety check fails
        $isSafetyFailure = (! $validated['tires_ok']) || (! $validated['brakes_ok']) || (! $validated['lights_ok']);

        if ($isSafetyFailure && $vehicle) {
            $vehicle->update(['status' => Vehicle::STATUS_UNSAFE_FOR_DRIVE, 'updated_at' => now()]);

            SystemLog::create([
                'datelog' => now()->toDateString(),
                'timelog' => now()->format('H:i:s'),
                'action' => 'ALERT',
                'module' => 'SAFETY',
                'performed_to' => (string) $vehicle->plate_number,
                'description' => 'SAFETY HARD-STOP: Vehicle #'.$vehicle->plate_number.' marked UNSAFE_FOR_DRIVE due to failed pre-trip inspection.',
            ]);
        }

        // Trigger Preventative Maintenance evaluation
        if ($vehicle) {
            \App\Services\PreventativeMaintenanceService::checkOdometerAndTriggerPM($vehicle, $validated['odometer_reading']);
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'INSPECTION',
            'performed_to' => $validated['vehicle_id'],
            'description' => 'Pre-trip vehicle safety inspection submitted by driver: '.$validated['driver_id'],
        ]);

        return redirect()->route('tasks.index');
    }
}
