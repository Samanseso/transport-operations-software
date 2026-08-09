<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\CodRemittance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CodRemittanceController extends Controller
{
    public function index(): Response
    {
        $remittances = CodRemittance::with('reservation.customer')->latest('created_at')->get();
        $totalCollectedCents = CodRemittance::where('status', 'VERIFIED_BY_FINANCE')->sum('amount_cents');
        $totalPendingCents = CodRemittance::where('status', 'PENDING_REMITTANCE')->sum('amount_cents');

        return Inertia::render('finance/cod-remittance', [
            'remittances' => $remittances,
            'totalCollectedCents' => (int) $totalCollectedCents,
            'totalPendingCents' => (int) $totalPendingCents,
        ]);
    }

    public function verify($id)
    {
        $remittance = CodRemittance::findOrFail($id);
        $remittance->update([
            'status' => 'VERIFIED_BY_FINANCE',
            'remitted_at' => now(),
        ]);

        return back()->with('success', 'COD Remittance #' . $remittance->remittance_code . ' verified by finance.');
    }
}
