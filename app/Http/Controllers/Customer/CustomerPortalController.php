<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class CustomerPortalController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $userId = $request->user()->id;
        $reservations = Reservation::where('customer_id', $userId)->latest()->get();

        return Inertia::render('customer/dashboard', [
            'reservations' => $reservations,
        ]);
    }

    public function bulkWaybills(): Response
    {
        return Inertia::render('customer/bulk-waybill');
    }

    public function processBulkWaybills(Request $request)
    {
        $validated = $request->validate([
            'destinations' => ['required', 'array', 'min:1'],
            'destinations.*.address' => ['required', 'string'],
            'destinations.*.consignee_name' => ['required', 'string'],
            'destinations.*.cargo_type' => ['nullable', 'string'],
            'destinations.*.cargo_weight_kg' => ['nullable', 'numeric'],
        ]);

        $createdCount = 0;
        foreach ($validated['destinations'] as $dest) {
            $waybillNumber = Reservation::generateWaybillNumber();
            $reservationId = (string) Str::orderedUuid();

            Reservation::create([
                'reservation_id' => $reservationId,
                'waybill_number' => $waybillNumber,
                'customer_id' => (string) $request->user()->id,
                'status' => 'PENDING',
                'pickup_address' => 'Corporate Main Warehouse',
                'pickup_latlng' => '14.5885,120.9691',
                'dropoff_address' => $dest['address'],
                'dropoff_latlng' => '14.6500,121.0500',
                'date' => date('Y-m-d'),
                'time' => '09:00',
                'service_type' => 'Cargo / Delivery Services',
                'cargo_type' => $dest['cargo_type'] ?? 'General Freight',
                'cargo_weight_kg' => (int) ($dest['cargo_weight_kg'] ?? 100),
                'waypoints' => [
                    [
                        'address' => $dest['address'],
                        'latlng' => '14.6500,121.0500',
                        'consignee_name' => $dest['consignee_name'],
                    ],
                ],
                'total_fare_cents' => 150000,
            ]);

            $createdCount++;
        }

        return redirect()->route('customer.portal.dashboard')->with('success', "{$createdCount} Bulk Waybills imported and queued for dispatch successfully.");
    }
}
