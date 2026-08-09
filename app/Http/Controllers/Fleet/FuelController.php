<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\FuelLog;
use App\Models\SystemLog;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FuelController extends Controller
{
    public function index(): Response
    {
        $fuelLogs = FuelLog::with(['vehicle', 'driver'])
            ->orderBy('filled_at', 'desc')
            ->get();

        $vehicles = Vehicle::with('driver')->get();
        $drivers = Driver::with('user')->get()->sortBy('name')->values();

        $stats = [
            'total_liters' => $fuelLogs->sum('liters'),
            'total_cost' => $fuelLogs->sum('total_cost'),
            'avg_cost_per_liter' => $fuelLogs->sum('liters') > 0 ? round($fuelLogs->sum('total_cost') / $fuelLogs->sum('liters'), 2) : 0,
            'log_count' => $fuelLogs->count(),
        ];

        return Inertia::render('admin/fleet-fuel', [
            'fuelLogs' => $fuelLogs,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => ['required', 'string', 'exists:vehicles,vehicle_id'],
            'driver_id' => ['nullable', 'string', 'exists:drivers,driver_id'],
            'liters' => ['required', 'numeric', 'min:0.1'],
            'total_cost' => ['required', 'numeric', 'min:0'],
            'odometer_reading' => ['required', 'integer', 'min:0'],
            'receipt_image_url' => ['nullable', 'string'],
        ]);

        $prevLog = FuelLog::where('vehicle_id', $validated['vehicle_id'])
            ->orderBy('filled_at', 'desc')
            ->first();

        $efficiencyKmL = null;
        $isAnomaly = false;

        if ($prevLog && $validated['odometer_reading'] > $prevLog->odometer_reading && $validated['liters'] > 0) {
            $kmDelta = $validated['odometer_reading'] - $prevLog->odometer_reading;
            $efficiencyKmL = round($kmDelta / ((float) $validated['liters']), 2);

            // Flag anomaly if efficiency drops by more than 25% compared to previous refuel
            if ($prevLog->efficiency_km_l && $prevLog->efficiency_km_l > 0) {
                $dropPercentage = (($prevLog->efficiency_km_l - $efficiencyKmL) / $prevLog->efficiency_km_l) * 100;
                if ($dropPercentage >= 25) {
                    $isAnomaly = true;

                    SystemLog::create([
                        'datelog' => now()->toDateString(),
                        'timelog' => now()->format('H:i:s'),
                        'action' => 'ALERT',
                        'module' => 'FUEL_ANOMALY',
                        'performed_to' => $validated['vehicle_id'],
                        'description' => 'FUEL ANOMALY: Vehicle ID '.$validated['vehicle_id'].' suffered a '.round($dropPercentage, 1).'% efficiency drop ('.$efficiencyKmL.' Km/L vs prev '.$prevLog->efficiency_km_l.' Km/L).',
                    ]);
                }
            }
        }

        FuelLog::create([
            'fuel_log_id' => (string) Str::orderedUuid(),
            'vehicle_id' => $validated['vehicle_id'],
            'driver_id' => $validated['driver_id'] ?? null,
            'liters' => $validated['liters'],
            'total_cost' => $validated['total_cost'],
            'total_cost_cents' => (int) round(((float) $validated['total_cost']) * 100),
            'odometer_reading' => $validated['odometer_reading'],
            'efficiency_km_l' => $efficiencyKmL,
            'is_anomaly' => $isAnomaly,
            'receipt_image_url' => $validated['receipt_image_url'] ?? null,
            'filled_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $vehicle = Vehicle::where('vehicle_id', $validated['vehicle_id'])->first();
        if ($vehicle) {
            \App\Services\PreventativeMaintenanceService::checkOdometerAndTriggerPM($vehicle, $validated['odometer_reading']);
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'FUEL',
            'performed_to' => $validated['vehicle_id'],
            'description' => 'Logged '.$validated['liters'].'L fuel for vehicle ID: '.$validated['vehicle_id'].($efficiencyKmL ? ' (Efficiency: '.$efficiencyKmL.' Km/L)' : ''),
        ]);

        return redirect()->route('fleet.fuel.index');
    }
}
