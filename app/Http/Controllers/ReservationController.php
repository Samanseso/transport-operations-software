<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\Dispatch;
use Carbon\Carbon;
use Illuminate\Support\Str;

use App\Http\Requests\Reservation\ProcessStep1Request;
use App\Http\Requests\Reservation\ProcessStep2Request;
use App\Http\Requests\Reservation\ProcessStep3Request;
use App\Http\Requests\Reservation\ProcessStep4Request;

use App\Events\ReservationDeleted;
use App\Events\ReservationCreated;

class ReservationController extends Controller
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
        return Inertia::render('admin/reservations', [
            'reservations' => Reservation::paginate(12)
        ]);
    }

    public function retrieve($id)
    {
        $reservation = Reservation::where('reservation_id', $id)->firstOrFail();
       
        return Inertia::render("admin/reservation-details", [
            'data' => $reservation,
        ]);
    }

    public function destroy(Request $request, $reservation_id): RedirectResponse
    {
        $page = $this->get_current_page($request);
        

        $reservation = Reservation::where('reservation_id', $reservation_id)->firstOrFail();

        broadcast(new ReservationDeleted($reservation_id));

        $reservation->delete();

        $dispatch = Dispatch::where('reservation_id', $reservation_id)->firstOrFail();
        
        if ($dispatch) {
            $dispatch->delete();
        }
        

        return redirect()
            ->route('reservations.index', ['page' => $page])
            ->with([
                'modal_status' => "success",
                'modal_action' => "delete",
                'modal_title' => "Reservation deleted!",
                'modal_message' => "Reservation " . $reservation->reservation_id . " was deleted successfully.",
            ]);
    }

    public function step(Request $request, $step)
    {

        if ((int)$step > 1 && (int)$step > session('current_step')) {
            return redirect()
            ->route('reservations.step', ['step' => session('current_step')])
            ->with(['message' => "Please finish step " . session('current_step') . "first!"]);
        };

       

        switch ($step) {
            case 1:
                return $this->renderStep1($request, $request->query('date') ?? date('Y-m-d'));
            case 2:
                return $this->renderStep2();
            case 3:
                return $this->renderStep3();
            case 4:
                return $this->renderStep4();
            case 5:
                return $this->renderStep5();
            default:
                return redirect()->route('reservations.step', ['step' => 1]);
        }
    }

    public function renderStep1(Request $request, $date)
    {
        try {
            $parsedDate = Carbon::parse($date)->toDateString();
        } catch (\Exception $e) {
            $parsedDate = Carbon::today()->toDateString();
        }

        



        // Get all vehicles dispatched on this date
        $dispatchedVehicles = Dispatch::whereDate('schedule', $parsedDate)
            ->pluck('vehicle_id');

        $unavailableVehicles = Vehicle::whereIn('vehicle_id', $dispatchedVehicles)
            ->get();

        // Get vehicles that are not dispatched and are marked AVAILABLE
        $availableVehicles = Vehicle::whereNotIn('vehicle_id', $dispatchedVehicles)
            ->where('status', 'AVAILABLE')
            ->get();



        return Inertia::render('admin/new-reservation/availability', [
            'date' => $parsedDate,
            'availableVehicles' => $availableVehicles,
            'unavailableVehicles' => $unavailableVehicles,
        ]);
    }

    public function renderStep2()
    {
        return Inertia::render('admin/new-reservation/location', [
            'location_type' => 'pickup',
            'pickup_address' => session('pickup_address'),
            'pickup_latlng' => session('pickup_latlng'),
        ]);
    }

    public function renderStep3()
    {
        return Inertia::render('admin/new-reservation/location', [
            'location_type'     => 'dropoff',
            'dropoff_address'   => session('dropoff_address'),
            'dropoff_latlng'    => session('dropoff_latlng'),
        ]);
    }

    public function renderStep4()
    {
        return Inertia::render('admin/new-reservation/details', [
            'customer_name'         => session('customer_name'),
            'email'                 => session('email'),
            'contact'               => session('contact'),
            'service_type'          => session('service_type'),
            'time'                  => session('time'),
            'cargo_details'         => session('cargo_details'),
            'special_instructions'  => session('special_instructions'),
        ]);
    }

    public function renderStep5()
    {
        return Inertia::render('admin/new-reservation/summary');
    }


    public function processStep1(ProcessStep1Request $request): RedirectResponse
    {

        $validated = $request->validated();

        $request->session()->put('vehicle_id', $validated['vehicle_id']);
        $request->session()->put('date', $validated['date']);
        $request->session()->put('current_step', 2);

        return redirect()->route('reservations.step', ['step' => 2]);
    }

    public function processStep2(ProcessStep2Request $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->session()->put('pickup_address', $validated['pickup_address']);
        $request->session()->put('pickup_latlng', $validated['pickup_latlng']);
        $request->session()->put('current_step', 3);

        return redirect()->route('reservations.step', ['step' => 3]);
    }

    public function processStep3(ProcessStep3Request $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->session()->put('dropoff_address', $validated['dropoff_address']);
        $request->session()->put('dropoff_latlng', $validated['dropoff_latlng']);
        $request->session()->put('current_step', 4);

        return redirect()->route('reservations.step', ['step' => 4]);
    }

    public function processStep4(ProcessStep4Request $request): RedirectResponse
    {
        

        $validated = $request->validated();

        

        $request->session()->put('customer_name', $validated['customer_name']);
        $request->session()->put('email', $validated['email']);
        $request->session()->put('contact', $validated['contact']);
        $request->session()->put('service_type', $validated['service_type']);
        $request->session()->put('time', $validated['time']);
        $request->session()->put('cargo_details', $validated['cargo_details']);
        $request->session()->put('special_instructions', $validated['special_instructions']);
        $request->session()->put('current_step', 5);

        return redirect()->route('reservations.step', ['step' => 5]);
    }

    public function processStep5(Request $request): RedirectResponse
    {
        $reservationId = Str::orderedUuid();

        Dispatch::create([
            'reservation_id'    => $reservationId,
            'vehicle_id'        => session('vehicle_id'),
            'schedule'          => session('date') . " " . session('time'),
            'assigned_at'       => now(),
        ]);

        $reservation = Reservation::create([
            'reservation_id'      => $reservationId,
            'pickup_address'      => session('pickup_address'),
            'pickup_latlng'       => session('pickup_latlng'),
            'dropoff_address'     => session('dropoff_address'),
            'dropoff_latlng'      => session('dropoff_latlng'),
            'customer_name'       => session('customer_name'),
            'email'               => session('email'),
            'contact'             => session('contact'),
            'service_type'        => session('service_type'),
            'date'                => session('date'),
            'time'                => session('time'),
            'cargo_details'       => session('cargo_details'),
            'special_instructions' => session('special_instructions'),
        ]);

        session()->forget([
            'pickup_address',
            'pickup_latlng',
            'dropoff_address',
            'dropoff_latlng',
            'customer_name',
            'email',
            'contact',
            'service_type',
            'time',
            'cargo_details',
            'special_instructions',
        ]);

        broadcast(new ReservationCreated ($reservation));

        return redirect()
            ->route('reservations.index')
            ->with([
                'modal_status' => "success",
                'modal_action' => "create",
                'modal_title' => "Reservation created!",
                'modal_message' => "Reservation " . $reservation->reservation_id . " was created successfully.",
            ]);
    }

}
