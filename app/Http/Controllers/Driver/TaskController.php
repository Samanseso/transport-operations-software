<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Dispatch;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Events\VehicleLocationUpdated;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $driver_id = $request->user()->role_id;
        $assigned_vehicle = Vehicle::where('driver_id', $driver_id)->first()->vehicle_id;

        $assigned_dispatches = Dispatch::where("vehicle_id", $assigned_vehicle)->pluck("reservation_id");

        return Inertia::render('driver/tasks', [
            'reservations' => Reservation::with('dispatch')
                ->whereHas('dispatch', function ($query) use ($assigned_dispatches) {
                    $query->whereIn('reservation_id', $assigned_dispatches);
                })
                ->get(),
        ]);
    }

    public function show($vehicle_id)
    {
        return Inertia::render('driver/task-details', [
            'reservation' => Reservation::with('dispatch')
                ->whereHas('dispatch', function ($query) use ($vehicle_id) {
                    $query->where('vehicle_id', $vehicle_id);
                })
                ->firstOrFail(),
        ]);
    }


    public function update(Request $request)
    {
        broadcast(new VehicleLocationUpdated(
            $request->vehicle_id,
            $request->latitude,
            $request->longitude
        ));
    }
}
