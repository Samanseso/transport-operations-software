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
                ]);
        }

        switch ($step) {
            case 1:
                return $this->renderStep1($request);
            case 2:
                return $this->renderStep2($request, $request->query('date') ?? (session('date') ?? $this->minimumReservationDate()));
            case 3:
                return $this->renderStep3($request);
            case 4:
                return $this->renderStep4($request);
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
        }

        switch ($step) {
            case 1:
                return $this->renderStep1($request);
            case 2:
                return $this->renderStep2($request, $request->query('date') ?? (session('date') ?? $this->minimumReservationDate()));
            case 3:
                return $this->renderStep3($request);
            case 4:
                return $this->renderStep4($request);
            default:
                return redirect()->route('reservations.edit.step', ['reservation_id' => $reservation_id, 'step' => 1]);
        }
    }

    public function renderStep1(Request $request)
    {
        return Inertia::render('admin/new-reservation/route-planning', [
            'pickup_address' => session('pickup_address', 'Metro Manila Port Area, Manila'),
            'pickup_latlng'  => session('pickup_latlng', '14.5885,120.9691'),
            'waypoints'      => session('waypoints', [
                [
                    'address'         => 'Novaliches Logistics Hub, Quezon City',
                    'latlng'          => '14.7000,121.0333',
                    'consignee_name'  => 'Juan Dela Cruz',
                    'consignee_phone' => '09171234567',
                    'instructions'    => 'Gate 2 Loading Dock',
                ],
            ]),
            'edit_mode'             => session()->has('edit_reservation_id'),
            'edit_reservation_id'   => session('edit_reservation_id'),
        ]);
    }

    public function renderStep2(Request $request, $date)
    {
        $parsedDate = $this->normalizeReservationDate($date);

        $dispatchedVehicles = Dispatch::whereDate('schedule', $parsedDate)->pluck('vehicle_id');

        $availableVehicles = Vehicle::with('driver')
            ->whereNotIn('vehicle_id', $dispatchedVehicles)
            ->where('status', 'AVAILABLE')
            ->get();

        $unavailableVehicles = Vehicle::with('driver')
            ->where(function ($q) use ($dispatchedVehicles) {
                $q->whereIn('vehicle_id', $dispatchedVehicles)
                    ->orWhereIn('status', ['IN_MAINTENANCE', 'UNSAFE_FOR_DRIVE']);
            })
            ->get();

        return Inertia::render('admin/new-reservation/fleet-allocation', [
            'date'                => session('date', $parsedDate),
            'time'                => session('time', '09:00'),
            'cargo_type'          => session('cargo_type', 'General Freight'),
            'cargo_weight_kg'     => session('cargo_weight_kg', 100),
            'selected_vehicle_id' => session('vehicle_id'),
            'availableVehicles'   => $availableVehicles,
            'unavailableVehicles' => $unavailableVehicles,
            'edit_mode'           => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function renderStep3(Request $request)
    {
        $customers = User::where('role', 'CUSTOMER')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/new-reservation/consignee-contacts', [
            'customer_id'           => session('customer_id') ?? $request->user()->id,
            'customers'             => $customers,
            'service_type'          => session('service_type', 'Cargo / Delivery Services'),
            'special_instructions'  => session('special_instructions'),
            'waypoints'             => session('waypoints', []),
            'edit_mode'             => session()->has('edit_reservation_id'),
            'edit_reservation_id'   => session('edit_reservation_id'),
        ]);
    }

    public function renderStep4(Request $request)
    {
        $selectedVehicle = session('vehicle_id')
            ? Vehicle::with('driver')->where('vehicle_id', session('vehicle_id'))->first()
            : null;

        $targetCustomerId = ($request->user()->role === 'CUSTOMER')
            ? $request->user()->id
            : (session('customer_id') ?? $request->user()->id);

        $customer = User::query()->select('id', 'name', 'email')->find($targetCustomerId);

        $waypoints = session('waypoints', []);
        $extraStopsCount = max(0, count($waypoints) - 1);

        $serviceType = session('service_type', 'Cargo / Delivery Services');
        $pricing = \App\Models\Pricing::where('service_type', $serviceType)->first();

        $baseRateCents = $pricing ? (int) ($pricing->base_rate_cents ?: ($pricing->base_rate * 100)) : 150000;
        $perKmRateCents = $pricing ? (int) ($pricing->distance_rate_cents ?: ($pricing->distance_rate * 100)) : 4500;
        $multiStopSurchargeCents = $extraStopsCount * 30000; // ₱300 per extra stop
        $totalFareCents = $baseRateCents + (15 * $perKmRateCents) + $multiStopSurchargeCents;

        return Inertia::render('admin/new-reservation/summary', [
            'summary' => [
                'customer_id'                => $targetCustomerId,
                'date'                       => $this->normalizeReservationDate(session('date', date('Y-m-d'))),
                'time'                       => session('time', '09:00'),
                'vehicle_id'                 => session('vehicle_id'),
                'pickup_address'             => session('pickup_address'),
                'pickup_latlng'              => session('pickup_latlng'),
                'dropoff_address'            => $waypoints[0]['address'] ?? session('dropoff_address', 'Destination'),
                'dropoff_latlng'             => $waypoints[0]['latlng'] ?? session('dropoff_latlng', '14.6,121.0'),
                'waypoints'                  => $waypoints,
                'service_type'               => $serviceType,
                'cargo_details'              => session('cargo_details', 'Standard Delivery'),
                'cargo_type'                 => session('cargo_type', 'General Freight'),
                'cargo_weight_kg'            => session('cargo_weight_kg', 100),
                'max_capacity_kg'            => session('max_capacity_kg', 1500),
                'special_instructions'       => session('special_instructions'),
                'base_fare_cents'            => $baseRateCents,
                'per_km_rate_applied_cents'  => $perKmRateCents,
                'multi_stop_surcharge_cents' => $multiStopSurchargeCents,
                'total_fare_cents'           => $totalFareCents,
            ],
            'selectedVehicle' => $selectedVehicle,
            'customer'        => $customer,
            'edit_mode'       => session()->has('edit_reservation_id'),
            'edit_reservation_id' => session('edit_reservation_id'),
        ]);
    }

    public function processStep1(ProcessStep1Request $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->session()->put('pickup_address', $validated['pickup_address']);
        $request->session()->put('pickup_latlng', $validated['pickup_latlng']);
        $request->session()->put('waypoints', $validated['waypoints']);
        $request->session()->put('current_step', 2);

        return redirect()->route('reservations.step', ['step' => 2]);
    }

    public function processStep2(ProcessStep2Request $request): RedirectResponse
    {
        $validated = $request->validated();

        $cargoWeightKg = (int) $validated['cargo_weight_kg'];
        $vehicle = Vehicle::where('vehicle_id', $validated['vehicle_id'])->firstOrFail();

        $vehicleMaxKg = 1500;
        if ($vehicle->capacity) {
            preg_match('/(\d+)/', $vehicle->capacity, $matches);
            if (! empty($matches[1])) {
                $vehicleMaxKg = (int) $matches[1];
            }
        }

        if ($cargoWeightKg > $vehicleMaxKg) {
            return back()->withErrors([
                'cargo_weight_kg' => "Selected vehicle payload capacity ({$vehicleMaxKg} kg) cannot carry requested cargo weight ({$cargoWeightKg} kg).",
            ]);
        }

        $request->session()->put('date', $validated['date']);
        $request->session()->put('time', $validated['time']);
        $request->session()->put('cargo_type', $validated['cargo_type']);
        $request->session()->put('cargo_weight_kg', $cargoWeightKg);
        $request->session()->put('max_capacity_kg', $vehicleMaxKg);
        $request->session()->put('vehicle_id', $validated['vehicle_id']);
        $request->session()->put('current_step', 3);

        return redirect()->route('reservations.step', ['step' => 3]);
    }

    public function processStep3(ProcessStep3Request $request): RedirectResponse
    {
        $validated = $request->validated();

        $targetCustomerId = ($request->user()->role === 'CUSTOMER')
            ? (string) $request->user()->id
            : (string) ($validated['customer_id'] ?? $request->user()->id);

        $request->session()->put('customer_id', $targetCustomerId);
        $request->session()->put('service_type', $validated['service_type']);
        $request->session()->put('special_instructions', $validated['special_instructions']);
        $request->session()->put('waypoints', $validated['waypoints']);
        $request->session()->put('current_step', 4);

        return redirect()->route('reservations.step', ['step' => 4]);
    }

    public function processStep4(ProcessStep4Request $request): RedirectResponse
    {
        return $this->processStep5($request);
    }

    public function processStep5(Request $request): RedirectResponse
    {
        $isEdit = session()->has('edit_reservation_id');
        $reservationId = $isEdit ? session('edit_reservation_id') : Str::orderedUuid();

        $targetCustomerId = ($request->user()->role === 'CUSTOMER')
            ? (string) $request->user()->id
            : (string) (session('customer_id') ?? $request->user()->id);

        $waypoints = session('waypoints', []);
        $firstDropoff = $waypoints[0] ?? ['address' => 'Destination', 'latlng' => '14.6,121.0'];

        $extraStopsCount = max(0, count($waypoints) - 1);
        $serviceType = session('service_type', 'Cargo / Delivery Services');
        $pricing = \App\Models\Pricing::where('service_type', $serviceType)->first();

        $baseRateCents = $pricing ? (int) ($pricing->base_rate_cents ?: ($pricing->base_rate * 100)) : 150000;
        $perKmRateCents = $pricing ? (int) ($pricing->distance_rate_cents ?: ($pricing->distance_rate * 100)) : 4500;
        $perMinRateCents = $pricing ? (int) ($pricing->travel_time_rate_cents ?: ($pricing->travel_time_rate * 100)) : 1500;
        $multiStopSurchargeCents = $extraStopsCount * 30000;
        $totalFareCents = $baseRateCents + (15 * $perKmRateCents) + $multiStopSurchargeCents;

        if ($isEdit) {
            $reservation = Reservation::where('reservation_id', $reservationId)->firstOrFail();
            $reservation->update([
                'pickup_address'             => session('pickup_address'),
                'pickup_latlng'              => session('pickup_latlng'),
                'dropoff_address'            => $firstDropoff['address'],
                'dropoff_latlng'             => $firstDropoff['latlng'],
                'waypoints'                  => $waypoints,
                'customer_id'                => $targetCustomerId,
                'service_type'               => $serviceType,
                'date'                       => session('date'),
                'time'                       => session('time'),
                'cargo_details'              => session('cargo_details', 'Standard Delivery'),
                'cargo_type'                 => session('cargo_type', 'General Freight'),
                'cargo_weight_kg'            => session('cargo_weight_kg', 100),
                'max_capacity_kg'            => session('max_capacity_kg', 1500),
                'special_instructions'       => session('special_instructions'),
                'multi_stop_surcharge_cents' => $multiStopSurchargeCents,
                'total_fare_cents'           => $totalFareCents,
            ]);

            $dispatch = Dispatch::where('reservation_id', $reservationId)->first();
            if ($dispatch) {
                $dispatch->update([
                    'vehicle_id' => session('vehicle_id'),
                    'schedule'   => session('date') . ' ' . session('time'),
                ]);
            }
        } else {
            $waybillNumber = Reservation::generateWaybillNumber();

            Dispatch::create([
                'reservation_id' => $reservationId,
                'vehicle_id'     => session('vehicle_id'),
                'schedule'       => session('date') . ' ' . session('time'),
                'assigned_at'    => now(),
            ]);

            $reservation = Reservation::create([
                'status'                     => 'PENDING',
                'reservation_id'             => $reservationId,
                'waybill_number'             => $waybillNumber,
                'pickup_address'             => session('pickup_address'),
                'pickup_latlng'              => session('pickup_latlng'),
                'dropoff_address'            => $firstDropoff['address'],
                'dropoff_latlng'             => $firstDropoff['latlng'],
                'waypoints'                  => $waypoints,
                'customer_id'                => $targetCustomerId,
                'service_type'               => $serviceType,
                'date'                       => session('date'),
                'time'                       => session('time'),
                'cargo_details'              => session('cargo_details', 'Standard Delivery'),
                'cargo_type'                 => session('cargo_type', 'General Freight'),
                'cargo_weight_kg'            => session('cargo_weight_kg', 100),
                'max_capacity_kg'            => session('max_capacity_kg', 1500),
                'special_instructions'       => session('special_instructions'),
                'total_fare_cents'           => $totalFareCents,
                'base_rate_applied_cents'    => $baseRateCents,
                'per_km_rate_applied_cents'  => $perKmRateCents,
                'per_min_rate_applied_cents' => $perMinRateCents,
                'multi_stop_surcharge_cents' => $multiStopSurchargeCents,
            ]);
        }

        if (! $isEdit) {
            SystemLog::create([
                'datelog'      => now()->toDateString(),
                'timelog'      => now()->format('H:i:s'),
                'action'       => 'ADD',
                'module'       => 'RESERVATIONS',
                'performed_to' => (string) $reservationId,
                'description'  => 'Reservation and Waybill #' . ($reservation->waybill_number ?: $reservationId) . ' was created.',
            ]);
        }

        session()->forget([
            'pickup_address',
            'pickup_latlng',
            'dropoff_address',
            'dropoff_latlng',
            'waypoints',
            'service_type',
            'time',
            'cargo_details',
            'cargo_type',
            'cargo_weight_kg',
            'max_capacity_kg',
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
                'modal_status'  => 'success',
                'modal_action'  => $isEdit ? 'update' : 'create',
                'modal_title'   => $isEdit ? 'Reservation updated!' : 'Waybill created!',
                'modal_message' => 'Waybill ' . ($reservation->waybill_number ?: $reservation->reservation_id) . ' was dispatched successfully.',
            ]);
    }

    public function printWaybill($reservation_id)
    {
        $reservation = Reservation::with(['dispatch.vehicle.driver', 'customer'])
            ->where('reservation_id', $reservation_id)
            ->firstOrFail();

        return Inertia::render('admin/waybill-print', [
            'reservation' => $reservation,
        ]);
    }
}
