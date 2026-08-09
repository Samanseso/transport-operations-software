<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceLog;
use App\Models\SparePart;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function index(): Response
    {
        $vehicles = Vehicle::with('driver')->get();
        $spareParts = SparePart::all();
        $logs = MaintenanceLog::with('vehicle')->latest('serviced_at')->get();

        return Inertia::render('admin/fleet-maintenance', [
            'vehicles' => $vehicles,
            'spareParts' => $spareParts,
            'logs' => $logs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,vehicle_id'],
            'service_type' => ['required', 'in:SCHEDULED_PM,REPAIR,EMERGENCY'],
            'odometer_km' => ['required', 'numeric', 'min:0'],
            'total_cost_cents' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $log = MaintenanceLog::create([
            'vehicle_id' => $validated['vehicle_id'],
            'service_type' => $validated['service_type'],
            'serviced_at' => now(),
            'odometer_km' => $validated['odometer_km'],
            'total_cost_cents' => $validated['total_cost_cents'],
            'notes' => $validated['notes'],
        ]);

        // Update vehicle last serviced odometer and mark as AVAILABLE if was IN_MAINTENANCE
        $vehicle = Vehicle::where('vehicle_id', $validated['vehicle_id'])->first();
        if ($vehicle) {
            $vehicle->update([
                'last_serviced_odometer' => $validated['odometer_km'],
                'status' => Vehicle::STATUS_AVAILABLE,
            ]);
        }

        return back()->with('success', 'Maintenance service log saved successfully.');
    }
}
