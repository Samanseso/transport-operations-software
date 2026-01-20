<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\DriverLocationUpdated;

class LocationController extends Controller
{
    public function updateLocation(Request $request)
    {
        broadcast(new DriverLocationUpdated(
            $request->driver_id,
            $request->lat,
            $request->lng
        ));

        return response()->json(['status' => 'ok']);
    }
}
