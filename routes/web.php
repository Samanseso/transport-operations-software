
<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/track/{waybill}', [\App\Http\Controllers\PublicTrackController::class, 'show'])->name('public.track');



Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('admin/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('admin.analytics');

    Route::get('finance/invoices', [\App\Http\Controllers\FinanceController::class, 'invoices'])->name('finance.invoices');
    Route::post('finance/invoices/{id}/pay', [\App\Http\Controllers\FinanceController::class, 'markPaid'])->name('finance.pay');
    Route::get('customer/invoices', [\App\Http\Controllers\FinanceController::class, 'customerInvoices'])->name('customer.invoices');
    Route::get('finance/cod-remittance', [\App\Http\Controllers\Finance\CodRemittanceController::class, 'index'])->name('finance.cod.index');
    Route::post('finance/cod-remittance/{id}/verify', [\App\Http\Controllers\Finance\CodRemittanceController::class, 'verify'])->name('finance.cod.verify');

    Route::get('client/dashboard', [\App\Http\Controllers\Customer\CustomerPortalController::class, 'dashboard'])->name('customer.portal.dashboard');
    Route::get('client/bulk-waybill', [\App\Http\Controllers\Customer\CustomerPortalController::class, 'bulkWaybills'])->name('customer.portal.bulk');
    Route::post('client/bulk-waybill', [\App\Http\Controllers\Customer\CustomerPortalController::class, 'processBulkWaybills'])->name('customer.portal.bulk.store');

    Route::get('hub', [\App\Http\Controllers\Hub\HubController::class, 'index'])->name('hub.index');
    Route::get('hub/scan', [\App\Http\Controllers\Hub\HubController::class, 'scan'])->name('hub.scan');
    Route::post('hub/scan', [\App\Http\Controllers\Hub\HubController::class, 'storeScan'])->name('hub.scan.store');
    Route::get('hub/manifests', [\App\Http\Controllers\Hub\HubController::class, 'manifests'])->name('hub.manifests');
    Route::post('hub/manifests', [\App\Http\Controllers\Hub\HubController::class, 'storeManifest'])->name('hub.manifests.store');

    Route::post('dispatch/auto-run', [\App\Http\Controllers\Admin\AutoDispatchController::class, 'triggerAutoDispatch'])->name('dispatch.auto');

    Route::get('fleet/maintenance', [\App\Http\Controllers\Fleet\MaintenanceController::class, 'index'])->name('fleet.maintenance.index');
    Route::post('fleet/maintenance', [\App\Http\Controllers\Fleet\MaintenanceController::class, 'store'])->name('fleet.maintenance.store');
    Route::post('fleet/spare-parts', [\App\Http\Controllers\Fleet\SparePartController::class, 'store'])->name('fleet.spare-parts.store');
    Route::put('fleet/spare-parts/{sparePart}', [\App\Http\Controllers\Fleet\SparePartController::class, 'update'])->name('fleet.spare-parts.update');
    Route::delete('fleet/spare-parts/{sparePart}', [\App\Http\Controllers\Fleet\SparePartController::class, 'destroy'])->name('fleet.spare-parts.destroy');
    Route::get('fleet/telematics', [\App\Http\Controllers\Fleet\TelematicsController::class, 'index'])->name('fleet.telematics.index');

    if (config('app.debug')) {
        Route::get('__auth_debug_protected', function (Request $request) {
            return response()->json([
                'path' => $request->path(),
                'auth_sanctum_user_id' => auth('sanctum')->user()?->id,
                'auth_web_user_id' => auth('web')->user()?->id,
            ]);
        });
    }
});

Route::middleware(['auth:sanctum', 'role:ADMINISTRATOR,DISPATCHER'])->group(function () {
    Route::get('api/customers/search', [\App\Http\Controllers\CustomerController::class, 'search'])->name('customers.search');
});

if (config('app.debug')) {
    Route::get('__auth_debug', function (Request $request) {
        $token = $request->cookie('auth_token');
        $pat = $token ? \Laravel\Sanctum\PersonalAccessToken::findToken($token) : null;

        return response()->json([
            'path' => $request->path(),
            'has_cookie' => $request->cookies->has('auth_token'),
            'cookie_len' => $token ? strlen((string) $token) : 0,
            'has_auth_header' => $request->headers->has('Authorization'),
            'auth_sanctum_user_id' => auth('sanctum')->user()?->id,
            'auth_web_user_id' => auth('web')->user()?->id,
            'token_found' => (bool) $pat,
            'token_id' => $pat?->id,
            'token_name' => $pat?->name,
            'token_expires_at' => $pat?->expires_at?->toIso8601String(),
            'token_last_used_at' => $pat?->last_used_at?->toIso8601String(),
        ]);
    });
}


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/user.php';
require __DIR__.'/reservations.php';
require __DIR__.'/active-dispatches.php';
require __DIR__.'/fleet.php';
require __DIR__.'/task.php';
require __DIR__.'/logs.php';

require __DIR__.'/my-reservations.php';
require __DIR__.'/my-active-reservations.php';
