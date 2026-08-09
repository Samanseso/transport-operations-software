<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Hub;
use App\Models\HubScan;
use App\Models\Manifest;
use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class HubController extends Controller
{
    public function index(): Response
    {
        $hubs = Hub::withCount(['scans', 'outboundManifests', 'inboundManifests'])->get();
        $recentScans = HubScan::with(['hub', 'reservation.customer'])
            ->latest('scanned_at')
            ->take(10)
            ->get();

        return Inertia::render('hub/dashboard', [
            'hubs' => $hubs,
            'recentScans' => $recentScans,
        ]);
    }

    public function scan(Request $request): Response
    {
        $hubs = Hub::all();
        $activeHubId = $request->query('hub_id', $hubs->first()?->id);

        $recentScans = HubScan::where('hub_id', $activeHubId)
            ->with('reservation')
            ->latest('scanned_at')
            ->take(15)
            ->get();

        return Inertia::render('hub/scan', [
            'hubs' => $hubs,
            'activeHubId' => (int) $activeHubId,
            'recentScans' => $recentScans,
        ]);
    }

    public function storeScan(Request $request)
    {
        $validated = $request->validate([
            'waybill_number' => ['required', 'string'],
            'hub_id' => ['required', 'exists:hubs,id'],
            'scan_type' => ['required', 'in:INBOUND_SORT,OUTBOUND_LINEHAUL,DISPATCH_HANDOVER'],
            'sorting_bin' => ['nullable', 'string', 'max:50'],
        ]);

        $reservation = Reservation::where('waybill_number', $validated['waybill_number'])
            ->orWhere('reservation_id', $validated['waybill_number'])
            ->first();

        if (! $reservation) {
            return back()->withErrors(['waybill_number' => 'Waybill Code not found in logistics registry.']);
        }

        $scan = HubScan::create([
            'waybill_number' => $reservation->waybill_number ?: $reservation->reservation_id,
            'hub_id' => $validated['hub_id'],
            'scan_type' => $validated['scan_type'],
            'sorting_bin' => $validated['sorting_bin'] ?: 'BIN-' . rand(101, 199),
            'scanned_by' => $request->user()->name,
            'scanned_at' => now(),
        ]);

        // Update reservation status depending on scan type
        if ($validated['scan_type'] === 'INBOUND_SORT') {
            $reservation->update(['status' => 'ARRIVED_AT_PICKUP']);
        } elseif ($validated['scan_type'] === 'OUTBOUND_LINEHAUL') {
            $reservation->update(['status' => 'IN_TRANSIT']);
        }

        return back()->with('success', 'Waybill #' . ($reservation->waybill_number ?: $reservation->reservation_id) . ' scanned successfully.');
    }

    public function manifests(): Response
    {
        $hubs = Hub::all();
        $vehicles = Vehicle::where('status', 'AVAILABLE')->get();
        $manifests = Manifest::with(['originHub', 'destinationHub', 'vehicle'])->latest()->get();

        return Inertia::render('hub/manifests', [
            'hubs' => $hubs,
            'vehicles' => $vehicles,
            'manifests' => $manifests,
        ]);
    }

    public function storeManifest(Request $request)
    {
        $validated = $request->validate([
            'origin_hub_id' => ['required', 'exists:hubs,id'],
            'destination_hub_id' => ['required', 'exists:hubs,id', 'different:origin_hub_id'],
            'vehicle_id' => ['required', 'exists:vehicles,vehicle_id'],
            'waybills' => ['required', 'array', 'min:1'],
        ]);

        $manifestCode = 'MAN-' . date('Y') . '-' . strtoupper(Str::random(5));

        Manifest::create([
            'manifest_code' => $manifestCode,
            'origin_hub_id' => $validated['origin_hub_id'],
            'destination_hub_id' => $validated['destination_hub_id'],
            'vehicle_id' => $validated['vehicle_id'],
            'status' => 'IN_TRANSIT',
            'waybills' => $validated['waybills'],
            'dispatched_at' => now(),
        ]);

        return back()->with('success', 'Trunkline Manifest #' . $manifestCode . ' dispatched.');
    }
}
