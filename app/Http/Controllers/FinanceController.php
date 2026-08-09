<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function invoices(Request $request): Response
    {
        $payments = Payment::with('reservation')->get();
        $reservations = Reservation::all();

        $stats = [
            'total_revenue' => $payments->sum('total_amount'),
            'paid_count' => $payments->whereNotNull('paid_at')->where('paid_at', '!=', '')->count(),
            'pending_count' => $reservations->count() - $payments->count(),
        ];

        return Inertia::render('admin/finance-invoices', [
            'payments' => $payments,
            'reservations' => $reservations,
            'stats' => $stats,
        ]);
    }

    public function customerInvoices(Request $request): Response
    {
        $user = $request->user();
        $payments = Payment::whereHas('reservation', function ($query) use ($user) {
            $query->where('email', $user->email)
                ->orWhere('customer_id', $user->id);
        })->with('reservation')->get();

        return Inertia::render('customer/invoices', [
            'payments' => $payments,
        ]);
    }

    public function markPaid(Request $request, string $reservationId)
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string'],
            'reference_number' => ['required', 'string'],
            'total_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $amountCents = (int) round(((float) $validated['total_amount']) * 100);

        $reservation = Reservation::where('reservation_id', $reservationId)->first();

        $distance = $request->input('distance') ?: ($reservation?->pickup_address ? '12.5 km' : '10 km');
        $travelTime = $request->input('travel_time') ?: ($reservation?->pickup_address ? '25 mins' : '30 mins');

        Payment::updateOrCreate(
            ['reservation_id' => $reservationId],
            [
                'distance' => $distance,
                'travel_time' => $travelTime,
                'total_amount' => (string) $validated['total_amount'],
                'total_amount_cents' => $amountCents,
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'paid_at' => now()->toDateTimeString(),
            ]
        );

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'FINANCE',
            'performed_to' => $reservationId,
            'description' => 'Marked invoice as PAID for reservation: '.$reservationId,
        ]);

        return back();
    }
}
