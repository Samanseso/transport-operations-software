<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Dispatch;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

use App\Events\VehicleLocationUpdated;
use App\Models\SystemLog;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $driver = \App\Models\Driver::where('user_id', $user?->id)->first();
        $driver_id = $driver ? $driver->driver_id : null;
        $assigned_vehicle = $driver_id ? Vehicle::where('driver_id', $driver_id)->first()?->vehicle_id : null;

        $assigned_dispatches = Dispatch::where("vehicle_id", $assigned_vehicle)->pluck("reservation_id");

        return Inertia::render('driver/tasks', [
            'reservations' => Reservation::with(['dispatch', 'customer'])
                ->whereHas('dispatch', function ($query) use ($assigned_dispatches) {
                    $query->whereIn('reservation_id', $assigned_dispatches);
                })
                ->get(),
        ]);
    }

    public function show($reservation_id)
    {
        return Inertia::render('driver/task-details', [
            'reservation' => Reservation::with(['dispatch', 'customer'])->where('reservation_id', $reservation_id)->firstOrFail(),
        ]);
    }


    public function update(Request $request)
    {
        try {
            broadcast(new VehicleLocationUpdated(
                $request->vehicle_id,
                $request->latitude,
                $request->longitude
            )); 

            Log::info('Reverb broadcast OK', [
                'channel' => 'vehicles',
                'event' => 'VehicleLocationUpdated',
                'vehicle_id' => $request->vehicle_id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Reverb broadcast FAILED', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function updateStatus(Request $request, $reservation_id)
    {
        $validated = $request->validate([
            'status' => ['required', 'string'],
            'pod_signature_url' => ['nullable', 'string'],
            'pod_photo_url' => ['nullable', 'string'],
            'pod_recipient_name' => ['nullable', 'string', 'max:150'],
        ]);

        $reservation = Reservation::where('reservation_id', $reservation_id)->firstOrFail();
        $oldStatus = $reservation->status;
        $newStatus = $validated['status'];

        $reservation->status = $newStatus;
        if (! empty($validated['pod_signature_url'])) {
            $reservation->pod_signature_url = $validated['pod_signature_url'];
            $reservation->pod_signed_at = now();
        }
        if (! empty($validated['pod_photo_url'])) {
            $reservation->pod_photo_url = $validated['pod_photo_url'];
        }
        if (! empty($validated['pod_recipient_name'])) {
            $reservation->pod_recipient_name = $validated['pod_recipient_name'];
        }
        $reservation->save();

        // Update assigned vehicle status accordingly
        $dispatch = Dispatch::where('reservation_id', $reservation_id)->first();
        if ($dispatch && $dispatch->vehicle_id) {
            $vehicle = Vehicle::where('vehicle_id', $dispatch->vehicle_id)->first();
            if ($vehicle && $vehicle->status !== Vehicle::STATUS_UNSAFE_FOR_DRIVE) {
                if (in_array($newStatus, ['DRIVER_EN_ROUTE_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'CARGO_LOADED', 'IN_TRANSIT'])) {
                    $vehicle->update(['status' => Vehicle::STATUS_IN_USE, 'updated_at' => now()]);
                } elseif (in_array($newStatus, ['DELIVERED', 'CANCELLED'])) {
                    $vehicle->update(['status' => Vehicle::STATUS_AVAILABLE, 'updated_at' => now()]);
                }
            }
        }

        // Broadcast real-time status update to web subscribers
        try {
            broadcast(new \App\Events\ReservationStatusChanged($reservation));
        } catch (\Throwable $e) {
            Log::warning('ReservationStatusChanged broadcast failed: '.$e->getMessage());
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'RESERVATIONS',
            'performed_to' => (string) $reservation_id,
            'description' => 'Waybill #'.($reservation->waybill_number ?: $reservation_id).' status transitioned from '.$oldStatus.' to '.$newStatus.'.',
        ]);

        return back(303);
    }

    public function updateWaypointPod(Request $request, $reservation_id, $waypoint_index)
    {
        $validated = $request->validate([
            'outcome' => ['required', 'string', 'in:SUCCESS,FAILED'],
            'pod_recipient_name' => ['nullable', 'string', 'max:150'],
            'pod_signature_url' => ['nullable', 'string'],
            'pod_photo_url' => ['nullable', 'string'],
            'reason_code' => ['nullable', 'string', 'max:150'],
        ]);

        $reservation = Reservation::where('reservation_id', $reservation_id)->firstOrFail();
        $waypoints = $reservation->waypoints ?: [];

        $idx = (int) $waypoint_index;
        if (isset($waypoints[$idx])) {
            $waypoints[$idx]['status'] = $validated['outcome'] === 'SUCCESS' ? 'DELIVERED' : 'FAILED';
            $waypoints[$idx]['pod_signed_at'] = now()->toDateTimeString();
            $waypoints[$idx]['pod_recipient_name'] = $validated['pod_recipient_name'] ?? null;
            $waypoints[$idx]['pod_signature_url'] = $validated['pod_signature_url'] ?? null;
            $waypoints[$idx]['pod_photo_url'] = $validated['pod_photo_url'] ?? null;
            $waypoints[$idx]['reason_code'] = $validated['reason_code'] ?? null;
        }

        $reservation->waypoints = $waypoints;

        $allDelivered = true;
        $anyFailed = false;
        foreach ($waypoints as $wp) {
            $st = $wp['status'] ?? 'PENDING';
            if ($st === 'FAILED') {
                $anyFailed = true;
            }
            if ($st !== 'DELIVERED' && $st !== 'FAILED') {
                $allDelivered = false;
            }
        }

        if ($allDelivered) {
            $reservation->status = $anyFailed ? 'PARTIAL_DELIVERY' : 'DELIVERED';
            $reservation->pod_signed_at = now();
            if (! empty($validated['pod_signature_url'])) {
                $reservation->pod_signature_url = $validated['pod_signature_url'];
            }
            if (! empty($validated['pod_recipient_name'])) {
                $reservation->pod_recipient_name = $validated['pod_recipient_name'];
            }

            $dispatch = Dispatch::where('reservation_id', $reservation_id)->first();
            if ($dispatch && $dispatch->vehicle_id) {
                $vehicle = Vehicle::where('vehicle_id', $dispatch->vehicle_id)->first();
                if ($vehicle && $vehicle->status !== Vehicle::STATUS_UNSAFE_FOR_DRIVE) {
                    $vehicle->update(['status' => Vehicle::STATUS_AVAILABLE]);
                }
            }
        }

        $reservation->save();

        try {
            broadcast(new \App\Events\ReservationStatusChanged($reservation));
        } catch (\Throwable $e) {
            Log::warning('ReservationStatusChanged broadcast failed: '.$e->getMessage());
        }

        return back(303);
    }
}
