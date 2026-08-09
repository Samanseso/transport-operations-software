<?php

namespace App\Http\Controllers\Fleet;

use App\Http\Controllers\Controller;
use App\Models\SparePart;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class SparePartController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:100', 'unique:spare_parts,sku'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'min_threshold' => ['required', 'integer', 'min:0'],
            'unit_cost_cents' => ['required', 'numeric', 'min:0'],
        ]);

        $part = SparePart::create($validated);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'MAINTENANCE_INVENTORY',
            'performed_to' => $part->sku,
            'description' => 'Spare part component '.$part->name.' (SKU: '.$part->sku.') registered in stock inventory.',
        ]);

        return back()->with('success', 'Spare part added to inventory successfully.');
    }

    public function update(Request $request, SparePart $sparePart)
    {
        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:100', 'unique:spare_parts,sku,'.$sparePart->id],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'min_threshold' => ['required', 'integer', 'min:0'],
            'unit_cost_cents' => ['required', 'numeric', 'min:0'],
        ]);

        $sparePart->update($validated);

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'MAINTENANCE_INVENTORY',
            'performed_to' => $sparePart->sku,
            'description' => 'Spare part component '.$sparePart->name.' (SKU: '.$sparePart->sku.') stock inventory updated.',
        ]);

        return back()->with('success', 'Spare part updated successfully.');
    }

    public function destroy(SparePart $sparePart)
    {
        $sku = $sparePart->sku;
        $name = $sparePart->name;
        $sparePart->delete();

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'DELETE',
            'module' => 'MAINTENANCE_INVENTORY',
            'performed_to' => $sku,
            'description' => 'Spare part component '.$name.' (SKU: '.$sku.') deleted from inventory.',
        ]);

        return back()->with('success', 'Spare part removed from inventory successfully.');
    }
}
