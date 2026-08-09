<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reservation;


class MyReservationController extends Controller
{
    public function get_current_page(Request $request)
    {
        $url = $request->header('referer');
        $parsedUrl = parse_url($url);
        $queryString = isset($parsedUrl['query']) ? $parsedUrl['query'] : 'page=1';
        parse_str($queryString, $queryParams);
        $page = $queryParams['page'] ?? 1;

        return $page;
    }

    public function validate_date($date)
    {
        $tempDate = explode('-', $date);

        // checkdate(month, day, year)
        return checkdate($tempDate[1], $tempDate[2], $tempDate[0]);
    }


    public function index(Request $request)
    {
        $user = $request->user();
        return Inertia::render('customer/my-reservations', [
            'reservations' => Reservation::with(['customer', 'dispatch'])
                ->where(function ($query) use ($user) {
                    $query->where('customer_id', (string) $user->id)
                        ->orWhere('email', $user->email);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::with([
            'customer',
            'dispatch',
            'dispatch.vehicle.driver',
        ])->where('reservation_id', $id)
        ->where(function ($query) use ($user) {
            $query->where('customer_id', (string) $user->id)
                ->orWhere('email', $user->email);
        })->firstOrFail();

        return Inertia::render("admin/reservation-details", [
            'reservation' => $reservation,
        ]);
    }
}
