<?php

namespace App\Services;

use App\Models\MaintenanceLog;
use App\Models\SystemLog;
use App\Models\Vehicle;
use Illuminate\Support\Str;

class PreventativeMaintenanceService
{
    /**
     * PM threshold in kilometers (default 10,000 km).
     */
    const PM_KM_THRESHOLD = 10000;

    /**
     * Evaluate vehicle odometer against PM threshold and trigger alert/servicing log if needed.
     */
    public static function checkOdometerAndTriggerPM(Vehicle $vehicle, int $currentOdometer): bool
    {
        $lastServiced = (int) ($vehicle->last_serviced_odometer ?? 0);
        $mileageDelta = $currentOdometer - $lastServiced;

        if ($mileageDelta >= self::PM_KM_THRESHOLD) {
            // Check if there is already a scheduled maintenance log for this vehicle
            $hasExistingScheduled = MaintenanceLog::where('vehicle_id', $vehicle->vehicle_id)
                ->where('status', 'SCHEDULED')
                ->exists();

            if (! $hasExistingScheduled) {
                MaintenanceLog::create([
                    'maintenance_id' => (string) Str::orderedUuid(),
                    'vehicle_id' => $vehicle->vehicle_id,
                    'service_type' => 'Automated Preventative Maintenance (10k PM)',
                    'odometer_reading' => $currentOdometer,
                    'cost' => '0.00',
                    'cost_cents' => 0,
                    'service_center' => 'System Automated PM Trigger',
                    'status' => 'SCHEDULED',
                    'scheduled_at' => now()->toDateString(),
                    'notes' => 'Automated PM alert: Vehicle odometer reached '.$currentOdometer.' km ('.$mileageDelta.' km since last service).',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            SystemLog::create([
                'datelog' => now()->toDateString(),
                'timelog' => now()->format('H:i:s'),
                'action' => 'ALERT',
                'module' => 'MAINTENANCE',
                'performed_to' => (string) $vehicle->plate_number,
                'description' => 'PM_DUE ALERT: Vehicle #'.$vehicle->plate_number.' reached '.$currentOdometer.' km ('.$mileageDelta.' km delta). Maintenance required.',
            ]);

            return true;
        }

        return false;
    }
}
