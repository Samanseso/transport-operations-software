<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\AutoDispatchJob;
use Illuminate\Http\Request;

class AutoDispatchController extends Controller
{
    public function triggerAutoDispatch(Request $request)
    {
        AutoDispatchJob::dispatchSync();

        return back()->with([
            'modal_status' => 'success',
            'modal_title' => 'Auto-Dispatch Engine Executed!',
            'modal_message' => 'Pending waybills have been matched to available fleet trucks using TSP route optimization.',
        ]);
    }
}
