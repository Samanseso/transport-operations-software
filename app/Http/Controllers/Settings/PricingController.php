<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Pricing;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    public function index(): Response
    {
        $pricings = Pricing::all();

        return Inertia::render('settings/pricing', [
            'pricings' => $pricings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_type' => ['required', 'string', 'max:100'],
            'base_rate' => ['required', 'numeric', 'min:0'],
            'distance_rate' => ['required', 'numeric', 'min:0'],
            'travel_time_rate' => ['required', 'numeric', 'min:0'],
        ]);

        Pricing::create([
            'pricing_id' => (string) Str::orderedUuid(),
            'service_type' => $validated['service_type'],
            'base_rate' => (string) $validated['base_rate'],
            'distance_rate' => (string) $validated['distance_rate'],
            'travel_time_rate' => (string) $validated['travel_time_rate'],
            'base_rate_cents' => (int) round(((float) $validated['base_rate']) * 100),
            'distance_rate_cents' => (int) round(((float) $validated['distance_rate']) * 100),
            'travel_time_rate_cents' => (int) round(((float) $validated['travel_time_rate']) * 100),
        ]);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'PRICING',
            'performed_to' => $validated['service_type'],
            'description' => 'Added pricing rate card for service: '.$validated['service_type'],
        ]);

        return back();
    }

    public function update(Request $request, string $id)
    {
        $pricing = Pricing::findOrFail($id);

        $validated = $request->validate([
            'service_type' => ['required', 'string', 'max:100'],
            'base_rate' => ['required', 'numeric', 'min:0'],
            'distance_rate' => ['required', 'numeric', 'min:0'],
            'travel_time_rate' => ['required', 'numeric', 'min:0'],
        ]);

        $pricing->update([
            'service_type' => $validated['service_type'],
            'base_rate' => (string) $validated['base_rate'],
            'distance_rate' => (string) $validated['distance_rate'],
            'travel_time_rate' => (string) $validated['travel_time_rate'],
            'base_rate_cents' => (int) round(((float) $validated['base_rate']) * 100),
            'distance_rate_cents' => (int) round(((float) $validated['distance_rate']) * 100),
            'travel_time_rate_cents' => (int) round(((float) $validated['travel_time_rate']) * 100),
        ]);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'PRICING',
            'performed_to' => $pricing->service_type,
            'description' => 'Updated pricing rate card: '.$pricing->service_type,
        ]);

        return back();
    }
}
