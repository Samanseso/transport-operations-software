<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\User;
use App\Models\Dispatch;
use Carbon\Carbon;
use Illuminate\Support\Str;

use App\Http\Requests\Reservation\ProcessStep1Request;
use App\Http\Requests\Reservation\ProcessStep2Request;
use App\Http\Requests\Reservation\ProcessStep3Request;
use App\Http\Requests\Reservation\ProcessStep4Request;

use App\Events\ReservationDeleted;
use App\Events\ReservationCreated;
use Illuminate\Support\Facades\Auth;
use App\Models\SystemLog;

class ReservationController extends Controller
{
    private function minimumReservationDate(): string
    {
        return Carbon::tomorrow()->toDateString();
    }

    private function normalizeReservationDate(?string $date): string
    {
        if (! $date) {
            return $this->minimumReservationDate();
        }

        try {
            $parsedDate = Carbon::parse($date)->startOfDay();
        } catch (\Exception $e) {
            return $this->minimumReservationDate();
        }

        $minimumDate = Carbon::tomorrow()->startOfDay();

        if ($parsedDate->lt($minimumDate)) {
            return $minimumDate->toDateString();
        }

        return $parsedDate->toDateString();
    }

    private function clearCreateSession(): void
    {
        session()->forget([
            'pickup_address',
            'pickup_latlng',
            'dropoff_address',
            'dropoff_latlng',
            'service_type',
            'time',
            'cargo_details',
            'special_instructions',
            'vehicle_id',
            'date',
            'customer_id',
            'edit_reservation_id',
            'current_step',
        ]);
    }

    private function seedEditSession(Reservation $reservation): void
    {
        $dispatch = Dispatch::where('reservation_id', $reservation->reservation_id)->first();

        session()->put('edit_reservation_id', $reservation->reservation_id);
        session()->put('current_step', 5);
        session()->put('vehicle_id', $dispatch?->vehicle_id);
        $dispatchSchedule = $dispatch?->schedule;
        session()->put('date', $reservation->date ?? ($dispatchSchedule ? Carbon::parse($dispatchSchedule)->toDateString() : null));
        session()->put('time', $reservation->time ?? ($dispatchSchedule ? Carbon::parse($dispatchSchedule)->format('H:i') : null));
        session()->put('pickup_address', $reservation->pickup_address);
        session()->put('pickup_latlng', $reservation->pickup_latlng);
        session()->put('dropoff_address', $reservation->dropoff_address);
        session()->put('dropoff_latlng', $reservation->dropoff_latlng);
        session()->put('service_type', $reservation->service_type);
        session()->put('cargo_details', $reservation->cargo_details);
        session()->put('special_instructions', $reservation->special_instructions);
        session()->put('customer_id', $reservation->customer_id);
    }
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
        $this->clearCreateSession();

        if ($request->user()->role === 'CUSTOMER') {
            return redirect()->route('my-reservations.index');
        }
        
        $query = Reservation::with(['customer', 'dispatch']);

        $search = trim((string) $request->query('q', ''));
        $status = $request->query('status');
        $serviceType = $request->query('service_type');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reservation_id', 'like', '%'.$search.'%')
                    ->orWhere('pickup_address', 'like', '%'.$search.'%')
                    ->orWhere('dropoff_address', 'like', '%'.$search.'%')
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%');
                    });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($serviceType) {
            $query->where('service_type', $serviceType);
        }

        if ($dateFrom && $dateTo) {
            $query->whereBetween('date', [$dateFrom, $dateTo]);
        } elseif ($dateFrom) {
            $query->where('date', '>=', $dateFrom);
        } elseif ($dateTo) {
            $query->where('date', '<=', $dateTo);
        }

        $reservations = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $statuses = Reservation::query()->select('status')->distinct()->orderBy('status')->pluck('status');
        $serviceTypes = Reservation::query()->select('service_type')->distinct()->orderBy('service_type')->pluck('service_type');

        return Inertia::render('admin/reservations', [
            'reservations' => $reservations,
            'filters' => [
                'q' => $search,
                'status' => $status,
                'service_type' => $serviceType,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'statuses' => $statuses,
            'serviceTypes' => $serviceTypes,
        ]);
    }

    public function show($id)
    {
        $this->clearCreateSession();

        $reservation = Reservation::with([
            'customer',
            'dispatch',
            'dispatch.vehicle.driver',
        ])->where('reservation_id', $id)->firstOrFail();

        return Inertia::render("admin/reservation-details", [
            'reservation' => $reservation,
        ]);
    }

    public function edit(Request $request, $reservation_id)
    {
        $reservation = Reservation::with(['dispatch'])->where('reservation_id', $reservation_id)->firstOrFail();
        $this->seedEditSession($reservation);

        return redirect()->route('reservations.edit.step', [
            'reservation_id' => $reservation_id,
            'step' => 1,
            'date' => $this->normalizeReservationDate(session('date')),
        ]);
    }

    public function destroy(Request $request, $reservation_id): RedirectResponse
    {
        $page = $this->get_current_page($request);

        $this->clearCreateSession();

        $reservation = Reservation::where('reservation_id', $reservation_id)->firstOrFail();

        broadcast(new ReservationDeleted($reservation_id));

        $reservation->delete();

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'DELETE',
            'module' => 'RESERVATIONS',
            'performed_to' => (string) $reservation_id,
            'description' => 'Reservation was deleted.',
        ]);

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
                ->route('reservations.step', ['step' => session('current_step') ?? 1])
                ->with([
                    'modal_status' => "error",
                    'modal_action' => "create",
                    'modal_title' => "Invalid action!",
                    'modal_message' => "Please finish previous steps first.",
                ]);;
        };



        switch ($step) {
            case 1:
                return $this->renderStep1($request, $request->query('date') ?? $this->minimumReservationDate());
            case 2:
                return $this->renderStep2();
            case 3:
                return $this->renderStep3();
            case 4:
                return $this->renderStep4($request);
            case 5:
                return $this->renderStep5($request);
            default:
                return redirect()->route('reservations.step', ['step' => 1]);
        }
    }

    public function editStep(Request $request, $reservation_id, $step)
    {
        if (session('edit_reservation_id') !== $reservation_id) {
            return $this->edit($request, $reservation_id);
        }

        if ((int)$step > 1 && (int)$step > session('current_step')) {
            return redirect()
                ->route('reservations.edit.step', ['reservation_id' => $reservation_id, 'step' => session('current_step') ?? 1])
                ->with([
                    'modal_status' => "error",
                    'modal_action' => "edit",
                    'modal_title' => "Invalid action!",
                    'modal_message' => "Please finish previous steps first.",
                ]);
        };

        switch ($step) {
            case 1:
                return $this->renderStep1($request, $request->query('date') ?? (session('date') ?? $this->minimumReservationDate()));
            case 2:
                return $this->renderStep2();
            case 3:
                return $this->renderStep3();
            case 4:
                return $this->renderStep4($request);
            case 5:
                return $this->renderStep5($request);
            default:
                return redirect()->route('reservations.edit.step', ['reservation_id' => $reservation_id, 'step' => 1]);
        }
    }

    public function renderStep1(Request $request, $date)
    {
        $parsedDate = $this->normalizeReservationDate($date);

        if (! $request->query('date') && session('date')) {
            $parsedDate = $this->normalizeReservationDate(session('date'));
        }




        // Get all vehicles dispatched on this date
        $dispatchedVehicles = Dispatch::whereDate('schedule', $parsedDate)
            ->pluck('vehicle_id');

        $unavailableVehicles = Vehicle::whereIn('vehicle_id', $dispatchedVehicles)
            ->get();

        // Get vehicles that are not dispatched and are marked AVAILABLE
        $availableVehicles = Vehicle::with('driver')->whereNotIn('vehicle_id', $dispatchedVehicles)
            ->where('status', 'AVAILABLE')
            ->get();



        return Inertia::render('admin/new-reservation/availability', [
            'date' => $parsedDate,
            'minimumDate' => $this->minimumReservationDate(),
            'availableVehicles' => $availableVehicles,
            'unavailableVehicles' => $unavailableVehicles,
            'edit_mode' => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function renderStep2()
    {
        return Inertia::render('admin/new-reservation/location', [
            'location_type' => 'pickup',
            'pickup_address' => session('pickup_address'),
            'pickup_latlng' => session('pickup_latlng'),
            'dropoff_address' => session('dropoff_address'),
            'dropoff_latlng' => session('dropoff_latlng'),
            'edit_mode' => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function renderStep3()
    {
        return Inertia::render('admin/new-reservation/location', [
            'location_type'     => 'dropoff',
            'dropoff_address'   => session('dropoff_address'),
            'dropoff_latlng'    => session('dropoff_latlng'),
            'pickup_address' => session('pickup_address'),
            'pickup_latlng' => session('pickup_latlng'),
            'edit_mode' => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function renderStep4(Request $request)
    {
        return Inertia::render('admin/new-reservation/details', [
            'customer_id'           => session('customer_id') ?? $request->user()->id,
            'service_type'          => session('service_type'),
            'time'                  => session('time'),
            'cargo_details'         => session('cargo_details'),
            'special_instructions'  => session('special_instructions'),
            'edit_mode' => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function renderStep5(Request $request)
    {
        $selectedVehicle = session('vehicle_id')
            ? Vehicle::with('driver')->where('vehicle_id', session('vehicle_id'))->first()
            : null;

        $customer = User::query()
            ->select('id', 'name', 'email')
            ->find(session('customer_id') ?? $request->user()->id);

        return Inertia::render('admin/new-reservation/summary', [
            'summary' => [
                'customer_id' => session('customer_id') ?? $request->user()->id,
                'date' => $this->normalizeReservationDate(session('date')),
                'time' => session('time'),
                'vehicle_id' => session('vehicle_id'),
                'pickup_address' => session('pickup_address'),
                'pickup_latlng' => session('pickup_latlng'),
                'dropoff_address' => session('dropoff_address'),
                'dropoff_latlng' => session('dropoff_latlng'),
                'service_type' => session('service_type'),
                'cargo_details' => session('cargo_details'),
                'special_instructions' => session('special_instructions'),
            ],
            'selectedVehicle' => $selectedVehicle,
            'customer' => $customer,
            'edit_mode' => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
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


        $request->session()->put('service_type', $validated['service_type']);
        $request->session()->put('time', $validated['time']);
        $request->session()->put('cargo_details', $validated['cargo_details']);
        $request->session()->put('special_instructions', $validated['special_instructions']);
        $request->session()->put('current_step', 5);

        return redirect()->route('reservations.step', ['step' => 5]);
    }

    public function processStep5(Request $request): RedirectResponse
    {
        $isEdit = session()->has('edit_reservation_id');
        $reservationId = $isEdit ? session('edit_reservation_id') : Str::orderedUuid();

        if ($isEdit) {
            $reservation = Reservation::where('reservation_id', $reservationId)->firstOrFail();
            $reservation->update([
                'pickup_address'       => session('pickup_address'),
                'pickup_latlng'        => session('pickup_latlng'),
                'dropoff_address'      => session('dropoff_address'),
                'dropoff_latlng'       => session('dropoff_latlng'),
                'customer_id'          => session('customer_id') ?? $request->user()->id,
                'service_type'         => session('service_type'),
                'date'                 => session('date'),
                'time'                 => session('time'),
                'cargo_details'        => session('cargo_details'),
                'special_instructions' => session('special_instructions'),
            ]);

            $dispatch = Dispatch::where('reservation_id', $reservationId)->first();
            if ($dispatch) {
                $dispatch->update([
                    'vehicle_id' => session('vehicle_id'),
                    'schedule' => session('date') . " " . session('time'),
                ]);
            } else {
                Dispatch::create([
                    'reservation_id'    => $reservationId,
                    'vehicle_id'        => session('vehicle_id'),
                    'schedule'          => session('date') . " " . session('time'),
                    'assigned_at'       => now(),
                ]);
            }
        } else {
            Dispatch::create([
                'reservation_id'    => $reservationId,
                'vehicle_id'        => session('vehicle_id'),
                'schedule'          => session('date') . " " . session('time'),
                'assigned_at'       => now(),
            ]);

            $reservation = Reservation::create([
                'status'               => "PENDING",
                'reservation_id'      => $reservationId,
                'pickup_address'      => session('pickup_address'),
                'pickup_latlng'       => session('pickup_latlng'),
                'dropoff_address'     => session('dropoff_address'),
                'dropoff_latlng'      => session('dropoff_latlng'),
                'customer_id'         => $request->user()->id,
                'service_type'        => session('service_type'),
                'date'                => session('date'),
                'time'                => session('time'),
                'cargo_details'       => session('cargo_details'),
                'special_instructions' => session('special_instructions'),
            ]);
        }

        if (! $isEdit) {
            SystemLog::create([
                'datelog' => now()->toDateString(),
                'timelog' => now()->format('H:i:s'),
                'action' => 'ADD',
                'module' => 'RESERVATIONS',
                'performed_to' => (string) $reservationId,
                'description' => 'Reservation was created.',
            ]);
        }

        session()->forget([
            'pickup_address',
            'pickup_latlng',
            'dropoff_address',
            'dropoff_latlng',
            'service_type',
            'time',
            'cargo_details',
            'special_instructions',
            'vehicle_id',
            'date',
            'customer_id',
            'edit_reservation_id',
        ]);

        if (! $isEdit) {
            broadcast(new ReservationCreated($reservation));
        }

        return redirect()
            ->route('reservations.index')
            ->with([
                'modal_status' => "success",
                'modal_action' => $isEdit ? "update" : "create",
                'modal_title' => $isEdit ? "Reservation updated!" : "Reservation created!",
                'modal_message' => "Reservation " . $reservation->reservation_id . " was " . ($isEdit ? "updated" : "created") . " successfully.",
            ]);
    }
}
