<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\CodRemittance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(): Response
    {
        $totalReservations = Reservation::count();
        $deliveredReservations = Reservation::where('status', 'DELIVERED')->count();
        $otdPercentage = $totalReservations > 0 ? round(($deliveredReservations / $totalReservations) * 100, 1) : 100.0;

        $totalVehicles = Vehicle::count();
        $inUseVehicles = Vehicle::where('status', Vehicle::STATUS_IN_USE)->count();
        $utilizationPct = $totalVehicles > 0 ? round(($inUseVehicles / $totalVehicles) * 100, 1) : 0.0;

        $totalRevenueCents = (int) Reservation::sum('total_fare_cents');
        $totalCodCents = (int) CodRemittance::where('status', 'VERIFIED_BY_FINANCE')->sum('amount_cents');

        $deliveryVolumeTrends = [
            ['day' => 'Mon', 'volume' => 42],
            ['day' => 'Tue', 'volume' => 58],
            ['day' => 'Wed', 'volume' => 65],
            ['day' => 'Thu', 'volume' => 78],
            ['day' => 'Fri', 'volume' => 90],
            ['day' => 'Sat', 'volume' => 84],
            ['day' => 'Sun', 'volume' => 35],
        ];

        return Inertia::render('admin/analytics', [
            'totalReservations' => $totalReservations,
            'otdPercentage' => $otdPercentage,
            'utilizationPct' => $utilizationPct,
            'totalRevenueCents' => $totalRevenueCents,
            'totalCodCents' => $totalCodCents,
            'deliveryVolumeTrends' => $deliveryVolumeTrends,
        ]);
    }
}
