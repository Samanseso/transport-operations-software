<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\Reservation;
use App\Models\Vehicle;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FleetController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/fleet-management', [
            'vehicles' => Vehicle::with('driver')->get()
        ]);
    }

    public function show($vehicle_id)
    {
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
        ]);
    }
}
