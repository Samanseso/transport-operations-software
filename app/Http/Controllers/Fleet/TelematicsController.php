<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\TelematicsLog;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TelematicsController extends Controller
{
    public function index(): Response
    {
        $vehicles = Vehicle::with('driver')->get();
        $telematicsLogs = TelematicsLog::with('vehicle')->latest('recorded_at')->take(20)->get();

        return Inertia::render('admin/fleet-telematics', [
            'vehicles' => $vehicles,
            'telematicsLogs' => $telematicsLogs,
        ]);
    }
}
