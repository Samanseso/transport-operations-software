<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicTrackController extends Controller
{
    public function show(string $waybill): Response
    {
        $reservation = Reservation::with(['dispatch.vehicle.driver', 'customer'])
            ->where('waybill_number', $waybill)
            ->orWhere('reservation_id', $waybill)
            ->firstOrFail();

        return Inertia::render('public/track', [
            'reservation' => $reservation,
        ]);
    }
}
