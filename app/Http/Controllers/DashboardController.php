<?php

namespace App\Http\Controllers;

use App\Models\Dispatch;
use App\Models\Driver;
use App\Models\Reservation;
use App\Models\SystemLog;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth('sanctum')->user();

        if (! $user) {
            abort(401, 'Unauthenticated');
        }

        return match ($user->role) {
            'ADMINISTRATOR' => $this->adminDashboard(),
            'DRIVER' => $this->driverDashboard($user),
            'CUSTOMER' => $this->customerDashboard($user),
            default => abort(403, 'Unauthorized'),
        };
    }

    private function adminDashboard(): Response
    {
        $today = Carbon::today();
        $last7Days = collect(range(6, 0))->map(fn (int $daysAgo) => Carbon::today()->subDays($daysAgo));

        $reservationCountByDay = Reservation::query()
            ->where('created_at', '>=', $today->copy()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as day, count(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $activityCountByDay = SystemLog::query()
            ->where('datelog', '>=', $today->copy()->subDays(6)->toDateString())
            ->selectRaw('datelog as day, count(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $reservationTrend = $last7Days->map(function (Carbon $date) use ($reservationCountByDay, $activityCountByDay) {
            $key = $date->toDateString();

            return [
                'label' => $date->format('M d'),
                'reservations' => (int) ($reservationCountByDay[$key] ?? 0),
                'activity' => (int) ($activityCountByDay[$key] ?? 0),
            ];
        })->values();

        $reservationStatusCounts = Reservation::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $fleetStatusCounts = Vehicle::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $userRoleCounts = User::query()
            ->selectRaw('role, count(*) as total')
            ->groupBy('role')
            ->pluck('total', 'role');

        $upcomingDispatches = Dispatch::query()
            ->with(['reservation.customer', 'vehicle.driver'])
            ->where('schedule', '>=', now())
            ->orderBy('schedule')
            ->limit(5)
            ->get()
            ->map(function (Dispatch $dispatch) {
                return [
                    'reservation_id' => $dispatch->reservation_id,
                    'schedule' => $dispatch->schedule,
                    'customer_name' => $dispatch->reservation?->customer?->name,
                    'vehicle_model' => $dispatch->vehicle?->model,
                    'driver_name' => $dispatch->vehicle?->driver?->name,
                    'status' => $dispatch->reservation?->status,
                ];
            })
            ->values();

        $recentLogs = SystemLog::query()
            ->orderBy('datelog', 'desc')
            ->orderBy('timelog', 'desc')
            ->limit(6)
            ->get()
            ->map(function (SystemLog $log) {
                return [
                    'datelog' => $log->datelog,
                    'timelog' => $log->timelog,
                    'action' => $log->action,
                    'module' => $log->module,
                    'performed_to' => $log->performed_to,
                    'description' => $log->description,
                ];
            })
            ->values();

        $reservationTotals = [
            'total' => Reservation::count(),
            'today' => Reservation::whereDate('created_at', $today)->count(),
            'active' => Reservation::whereIn('status', Reservation::getActiveStatuses())->count(),
            'completed' => Reservation::whereIn('status', ['DELIVERED', 'COMPLETE', 'COMPLETED'])->count(),
        ];

        $fleetTotals = [
            'total' => Vehicle::count(),
            'available' => Vehicle::where('status', 'AVAILABLE')->count(),
            'maintenance' => Vehicle::where('status', 'MAINTENANCE')->count(),
            'assigned' => Vehicle::whereNotNull('driver_id')->count(),
        ];

        $userTotals = [
            'customers' => User::where('role', 'CUSTOMER')->count(),
            'drivers' => User::where('role', 'DRIVER')->count(),
            'admins' => User::where('role', 'ADMINISTRATOR')->count(),
            'drivers_without_vehicle' => Driver::doesntHave('vehicle')->count(),
        ];

        $activeDispatches = Reservation::query()
            ->with([
                'customer',
                'dispatch',
                'dispatch.vehicle',
                'dispatch.vehicle.driver',
            ])
            ->whereIn('status', Reservation::getActiveStatuses())
            ->latest()
            ->get();

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'reservations' => $reservationTotals,
                'fleet' => $fleetTotals,
                'users' => $userTotals,
                'dispatches_today' => Dispatch::whereDate('schedule', $today)->count(),
                'logs_today' => SystemLog::where('datelog', $today->toDateString())->count(),
            ],
            'trends' => [
                'activity' => $reservationTrend,
            ],
            'breakdowns' => [
                'reservation_statuses' => $this->formatBreakdown($reservationStatusCounts),
                'fleet_statuses' => $this->formatBreakdown($fleetStatusCounts),
                'user_roles' => $this->formatBreakdown($userRoleCounts),
            ],
            'upcomingDispatches' => $upcomingDispatches,
            'recentLogs' => $recentLogs,
            'activeDispatches' => $activeDispatches,
        ]);
    }

    private function driverDashboard(User $user): Response
    {
        $today = Carbon::today();
        $driver = Driver::where('user_id', $user->id)->first();
        $assignedVehicle = $driver ? Vehicle::with('driver')->where('driver_id', $driver->driver_id)->first() : null;

        $reservationsQuery = Reservation::query()
            ->with(['customer', 'dispatch'])
            ->when(
                $assignedVehicle,
                fn ($query) => $query->whereHas('dispatch', fn ($dispatchQuery) => $dispatchQuery->where('vehicle_id', $assignedVehicle->vehicle_id)),
                fn ($query) => $query->whereRaw('1 = 0')
            );

        $statusCounts = (clone $reservationsQuery)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $upcomingTasks = (clone $reservationsQuery)
            ->whereHas('dispatch', fn ($query) => $query->where('schedule', '>=', now()->toDateTimeString()))
            ->orderBy(
                Dispatch::select('schedule')
                    ->whereColumn('dispatches.reservation_id', 'reservations.reservation_id')
                    ->limit(1)
            )
            ->limit(5)
            ->get()
            ->map(function (Reservation $reservation) {
                return [
                    'reservation_id' => $reservation->reservation_id,
                    'customer_name' => $reservation->customer?->name,
                    'schedule' => $reservation->dispatch?->schedule,
                    'status' => $reservation->status,
                    'pickup_address' => $reservation->pickup_address,
                    'dropoff_address' => $reservation->dropoff_address,
                ];
            })
            ->values();

        return Inertia::render('driver/dashboard', [
            'metrics' => [
                'assigned_vehicle' => $assignedVehicle ? [
                    'vehicle_id' => $assignedVehicle->vehicle_id,
                    'plate_number' => $assignedVehicle->plate_number,
                    'model' => $assignedVehicle->model,
                    'status' => $assignedVehicle->status,
                ] : null,
                'total_tasks' => (clone $reservationsQuery)->count(),
                'active_tasks' => (clone $reservationsQuery)
                    ->whereIn('status', Reservation::getActiveStatuses())
                    ->count(),
                'completed_tasks' => (clone $reservationsQuery)->whereIn('status', ['DELIVERED', 'COMPLETE', 'COMPLETED'])->count(),
                'today_tasks' => (clone $reservationsQuery)
                    ->whereHas('dispatch', fn ($query) => $query->whereDate('schedule', $today))
                    ->count(),
            ],
            'breakdowns' => [
                'task_statuses' => $this->formatBreakdown($statusCounts),
            ],
            'upcomingTasks' => $upcomingTasks,
        ]);
    }

    private function customerDashboard(User $user): Response
    {
        $today = Carbon::today();

        $reservationsQuery = Reservation::query()
            ->with(['dispatch.vehicle.driver'])
            ->where('customer_id', $user->id);

        $serviceCounts = (clone $reservationsQuery)
            ->selectRaw('service_type, count(*) as total')
            ->groupBy('service_type')
            ->pluck('total', 'service_type');

        $recentReservations = (clone $reservationsQuery)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function (Reservation $reservation) {
                return [
                    'reservation_id' => $reservation->reservation_id,
                    'status' => $reservation->status,
                    'service_type' => $reservation->service_type,
                    'schedule' => $reservation->dispatch?->schedule,
                    'driver_name' => $reservation->dispatch?->vehicle?->driver?->name,
                    'vehicle_model' => $reservation->dispatch?->vehicle?->model,
                ];
            })
            ->values();

        return Inertia::render('customer/dashboard', [
            'metrics' => [
                'total_reservations' => (clone $reservationsQuery)->count(),
                'active_reservations' => (clone $reservationsQuery)
                    ->whereIn('status', Reservation::getActiveStatuses())
                    ->count(),
                'completed_reservations' => (clone $reservationsQuery)->whereIn('status', ['DELIVERED', 'COMPLETE', 'COMPLETED'])->count(),
                'new_this_month' => (clone $reservationsQuery)->where('created_at', '>=', $today->copy()->startOfMonth())->count(),
            ],
            'breakdowns' => [
                'service_types' => $this->formatBreakdown($serviceCounts),
            ],
            'recentReservations' => $recentReservations,
        ]);
    }

    private function formatBreakdown(Collection $counts): array
    {
        $total = (int) $counts->sum();

        return $counts
            ->map(function ($value, $label) use ($total) {
                $count = (int) $value;

                return [
                    'label' => (string) $label,
                    'count' => $count,
                    'percentage' => $total > 0 ? (int) round(($count / $total) * 100) : 0,
                ];
            })
            ->sortByDesc('count')
            ->values()
            ->all();
    }
}
