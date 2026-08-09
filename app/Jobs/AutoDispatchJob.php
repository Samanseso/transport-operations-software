<?php

namespace App\Jobs;

use App\Models\Dispatch;
use App\Models\Reservation;
use App\Models\SystemLog;
use App\Models\Vehicle;
use App\Services\RouteOptimizationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AutoDispatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $pendingReservations = Reservation::where('status', 'PENDING')->get();

        foreach ($pendingReservations as $reservation) {
            $cargoWeight = $reservation->cargo_weight_kg ?: 100;

            // Find available vehicle with capacity >= cargoWeight
            $vehicle = Vehicle::where('status', 'AVAILABLE')
                ->get()
                ->first(function ($v) use ($cargoWeight) {
                    preg_match('/(\d+)/', $v->capacity ?: '1500', $m);
                    $maxKg = isset($m[1]) ? (int) $m[1] : 1500;
                    return $maxKg >= $cargoWeight;
                });

            if ($vehicle) {
                // Optimize waypoints sequence
                if (! empty($reservation->waypoints)) {
                    $optimizedWaypoints = RouteOptimizationService::optimizeWaypoints(
                        $reservation->pickup_latlng ?: '14.5885,120.9691',
                        $reservation->waypoints
                    );
                    $reservation->waypoints = $optimizedWaypoints;
                }

                $reservation->status = 'ASSIGNED';
                $reservation->save();

                // Create or update dispatch record
                Dispatch::updateOrCreate(
                    ['reservation_id' => $reservation->reservation_id],
                    [
                        'vehicle_id' => $vehicle->vehicle_id,
                        'schedule' => $reservation->date . ' ' . $reservation->time,
                        'assigned_at' => now(),
                    ]
                );

                $vehicle->update(['status' => Vehicle::STATUS_IN_USE]);

                SystemLog::create([
                    'datelog' => now()->toDateString(),
                    'timelog' => now()->format('H:i:s'),
                    'action' => 'UPDATE',
                    'module' => 'AUTO_DISPATCH',
                    'performed_to' => (string) $reservation->reservation_id,
                    'description' => 'Waybill #' . ($reservation->waybill_number ?: $reservation->reservation_id) . ' auto-dispatched to vehicle ' . $vehicle->plate_number . '.',
                ]);

                Log::info('AutoDispatchJob matched waybill', [
                    'waybill' => $reservation->waybill_number,
                    'vehicle' => $vehicle->vehicle_id,
                ]);
            }
        }
    }
}
