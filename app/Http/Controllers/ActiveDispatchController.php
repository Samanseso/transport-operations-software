<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ActiveDispatchController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with([
            'customer',
            'dispatch',
            'dispatch.vehicle',
            'dispatch.vehicle.driver',
        ])->whereIn('status', Reservation::getActiveStatuses());

        $search = trim((string) $request->query('q', ''));
        $status = $request->query('status');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reservation_id', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    })
                    ->orWhereHas('dispatch.vehicle', function ($vq) use ($search) {
                        $vq->where('model', 'like', '%'.$search.'%')
                            ->orWhere('plate_number', 'like', '%'.$search.'%');
                    })
                    ->orWhereHas('dispatch.vehicle.driver', function ($dq) use ($search) {
                        $dq->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $reservations = $query->get();

        return Inertia::render('admin/active-dispatches', [
            'reservations' => $reservations,
            'filters' => [
                'q' => $search,
                'status' => $status,
            ],
            'statuses' => Reservation::getActiveStatuses(),
        ]);
    }


    public function show(Request $request, $selectedReservation)
    {
        $query = Reservation::with([
            'customer',
            'dispatch',
            'dispatch.vehicle',
            'dispatch.vehicle.driver',
        ])->whereIn('status', Reservation::getActiveStatuses());

        $search = trim((string) $request->query('q', ''));
        $status = $request->query('status');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reservation_id', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    })
                    ->orWhereHas('dispatch.vehicle', function ($vq) use ($search) {
                        $vq->where('model', 'like', '%'.$search.'%')
                            ->orWhere('plate_number', 'like', '%'.$search.'%');
                    })
                    ->orWhereHas('dispatch.vehicle.driver', function ($dq) use ($search) {
                        $dq->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $reservations = $query->get();

        return Inertia::render('admin/active-dispatches', [
            'reservations' => $reservations,
            'selectedReservation' => $reservations->firstWhere('reservation_id', $selectedReservation),
            'filters' => [
                'q' => $search,
                'status' => $status,
            ],
            'statuses' => Reservation::getActiveStatuses(),
        ]);
    }
}
