<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Payment;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers with pagination and filtering.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));

        $query = User::where('role', 'CUSTOMER')
            ->withCount('reservations')
            ->select('id', 'name', 'email', 'created_at', 'updated_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('id', 'like', '%'.$search.'%');
            });
        }

        $customers = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/customers', [
            'customers' => $customers,
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created customer profile.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:50'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $password = ! empty($validated['password']) ? $validated['password'] : 'Password123!';

        $customer = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
            'role' => 'CUSTOMER',
        ]);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'CUSTOMERS',
            'performed_to' => (string) $customer->id,
            'description' => 'Customer account created for '.$customer->name.' ('.$customer->email.').',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'customer' => $customer,
                'message' => 'Customer profile created successfully.',
            ]);
        }

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Customer Created!',
            'modal_message' => 'Customer '.$customer->name.' (#'.$customer->id.') created successfully.',
        ]);
    }

    /**
     * Display customer details, order history, and payment summary.
     */
    public function show(string $id)
    {
        $customer = User::where('id', $id)
            ->where('role', 'CUSTOMER')
            ->firstOrFail();

        $reservations = Reservation::with(['dispatch', 'dispatch.vehicle'])
            ->where('customer_id', $customer->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $payments = Payment::whereHas('reservation', function ($q) use ($customer) {
            $q->where('customer_id', $customer->id);
        })->get();

        $totalSpentCents = $payments->sum('total_amount_cents');
        $unpaidReservationsCount = $reservations->where('status', '!=', 'COMPLETED')->count();

        return response()->json([
            'customer' => $customer,
            'stats' => [
                'total_reservations' => $reservations->count(),
                'total_spent_cents' => $totalSpentCents,
                'unpaid_count' => $unpaidReservationsCount,
            ],
            'reservations' => $reservations,
            'payments' => $payments,
        ]);
    }

    /**
     * API search method for CustomerComboBox dropdown in booking wizard.
     */
    public function search(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        $customers = User::where('role', 'CUSTOMER')
            ->when($query !== '', function ($q) use ($query) {
                $q->where(function ($sub) use ($query) {
                    $sub->where('name', 'like', '%'.$query.'%')
                        ->orWhere('email', 'like', '%'.$query.'%')
                        ->orWhere('id', 'like', '%'.$query.'%');
                });
            })
            ->select('id', 'name', 'email')
            ->limit(20)
            ->get();

        return response()->json($customers);
    }
}
