import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import FleetmanagementLayout from '@/layouts/fleet-management/layout';
import { BreadcrumbItem, Vehicle } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit2, Package, Plus, Trash2, Wrench, X } from 'lucide-react';
import React, { useState } from 'react';

interface SparePart {
    id: number;
    sku: string;
    name: string;
    category: string;
    stock_quantity: number;
    min_threshold: number;
    unit_cost_cents: number;
}

interface LogItem {
    id?: number;
    maintenance_id?: string;
    vehicle?: Vehicle;
    service_type: string;
    serviced_at: string;
    odometer_km: number;
    total_cost_cents: number;
    notes?: string;
}

interface Props {
    vehicles: Vehicle[];
    spareParts: SparePart[];
    logs: LogItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fleet Management', href: '/fleet' },
    { title: 'Maintenance Logs', href: '/fleet/maintenance' },
];

export default function FleetMaintenance({ vehicles, spareParts, logs }: Props) {
    // Log Servicing Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.vehicle_id || '');
    const [serviceType, setServiceType] = useState('SCHEDULED_PM');
    const [odometerKm, setOdometerKm] = useState(50000);
    const [costCents, setCostCents] = useState(150000);
    const [notes, setNotes] = useState('10k Scheduled PM Servicing & Filter Replacement');

    // Spare Part CRUD Modals
    const [isPartCreateOpen, setIsPartCreateOpen] = useState(false);
    const [editingPart, setEditingPart] = useState<SparePart | null>(null);
    const [deletingPart, setDeletingPart] = useState<SparePart | null>(null);

    // Spare Part Form State
    const [partSku, setPartSku] = useState('');
    const [partName, setPartName] = useState('');
    const [partCategory, setPartCategory] = useState('Tires & Brakes');
    const [partStockQuantity, setPartStockQuantity] = useState(20);
    const [partMinThreshold, setPartMinThreshold] = useState(5);
    const [partUnitCostPhp, setPartUnitCostPhp] = useState(2500);

    const resetPartForm = () => {
        setPartSku('');
        setPartName('');
        setPartCategory('Tires & Brakes');
        setPartStockQuantity(20);
        setPartMinThreshold(5);
        setPartUnitCostPhp(2500);
    };

    const handleLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/fleet/maintenance',
            {
                vehicle_id: selectedVehicle,
                service_type: serviceType,
                odometer_km: odometerKm,
                total_cost_cents: costCents,
                notes,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsCreateModalOpen(false),
            },
        );
    };

    const handlePartCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/fleet/spare-parts',
            {
                sku: partSku,
                name: partName,
                category: partCategory,
                stock_quantity: partStockQuantity,
                min_threshold: partMinThreshold,
                unit_cost_cents: Math.round(partUnitCostPhp * 100),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsPartCreateOpen(false);
                    resetPartForm();
                },
            },
        );
    };

    const handlePartUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPart) return;
        router.put(
            `/fleet/spare-parts/${editingPart.id}`,
            {
                sku: partSku,
                name: partName,
                category: partCategory,
                stock_quantity: partStockQuantity,
                min_threshold: partMinThreshold,
                unit_cost_cents: Math.round(partUnitCostPhp * 100),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingPart(null);
                    resetPartForm();
                },
            },
        );
    };

    const handlePartDeleteConfirm = () => {
        if (!deletingPart) return;
        router.delete(`/fleet/spare-parts/${deletingPart.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingPart(null),
        });
    };

    const openEditPartModal = (part: SparePart) => {
        setEditingPart(part);
        setPartSku(part.sku);
        setPartName(part.name);
        setPartCategory(part.category);
        setPartStockQuantity(part.stock_quantity);
        setPartMinThreshold(part.min_threshold);
        setPartUnitCostPhp(part.unit_cost_cents / 100);
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Fleet Preventative Servicing & Parts Inventory" />
                <FleetmanagementLayout vehicles={vehicles}>
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
                                    Preventative Maintenance & Spare Parts Inventory
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Track 10k PM scheduled servicing intervals, spare parts stock levels, and repair logs.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        resetPartForm();
                                        setIsPartCreateOpen(true);
                                    }}
                                    variant="outline"
                                    className="font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Spare Part
                                </Button>
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]"
                                >
                                    <Wrench className="mr-1 h-4 w-4" />
                                    Log Servicing Record
                                </Button>
                            </div>
                        </div>

                        {/* Spare Parts Stock Table */}
                        <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                        <Package className="h-4 w-4 text-sky-500" />
                                        Spare Parts Stock Level & Inventory Monitor
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Monitors critical replacement components (tires, brake pads, oils) and alerts when stock drops below safety
                                        reorder threshold.
                                    </p>
                                </div>
                                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                                    {(spareParts ?? []).length} Components Tracked
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        <tr>
                                            <th className="p-3">SKU</th>
                                            <th className="p-3">Part Name</th>
                                            <th className="p-3">Category</th>
                                            <th className="p-3">In Stock</th>
                                            <th className="p-3">Min Threshold</th>
                                            <th className="p-3">Unit Cost</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                        {(spareParts ?? []).map((p, idx) => (
                                            <tr key={p.id || p.sku || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">{p.sku}</td>
                                                <td className="p-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                                                <td className="p-3">{p.category}</td>
                                                <td className="p-3 font-mono">
                                                    <span
                                                        className={
                                                            p.stock_quantity <= p.min_threshold
                                                                ? 'rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                                : 'font-semibold'
                                                        }
                                                    >
                                                        {p.stock_quantity} units
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono text-slate-500">{p.min_threshold} units</td>
                                                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₱{(p.unit_cost_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditPartModal(p)}
                                                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletingPart(p)}
                                                            className="rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Maintenance History Table */}
                        <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Vehicle Maintenance Logs</h3>
                                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                                    {(logs ?? []).length} Logged Services
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        <tr>
                                            <th className="p-3">Vehicle</th>
                                            <th className="p-3">Service Type</th>
                                            <th className="p-3">Serviced At</th>
                                            <th className="p-3">Odometer</th>
                                            <th className="p-3">Cost</th>
                                            <th className="p-3">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                        {(logs ?? []).map((log, idx) => (
                                            <tr
                                                key={log.maintenance_id || log.id || `log-${idx}`}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                                    {log.vehicle?.model || 'Vehicle'} ({log.vehicle?.plate_number || log.vehicle?.vehicle_id || 'N/A'})
                                                </td>
                                                <td className="p-3">
                                                    <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                        {log.service_type}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-mono">
                                                    {log.serviced_at ? new Date(log.serviced_at).toLocaleDateString() : 'Today'}
                                                </td>
                                                <td className="p-3 font-mono">{log.odometer_km?.toLocaleString()} km</td>
                                                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₱{(log.total_cost_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="max-w-xs truncate p-3 text-slate-500">{log.notes || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal: Log Servicing Record */}
                        {isCreateModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <Wrench className="h-4 w-4 text-amber-500" /> Log Vehicle Servicing Record
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Select Vehicle</label>
                                            <select
                                                value={selectedVehicle}
                                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                                className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                {vehicles.map((v) => (
                                                    <option key={v.vehicle_id} value={v.vehicle_id}>
                                                        {v.model} ({v.plate_number})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Service Category</label>
                                            <select
                                                value={serviceType}
                                                onChange={(e) => setServiceType(e.target.value)}
                                                className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="SCHEDULED_PM">Scheduled Preventative Maintenance (10k PM)</option>
                                                <option value="REPAIR">Component Repair & Replacement</option>
                                                <option value="EMERGENCY">Emergency Breakdown Service</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Odometer (km)</label>
                                            <input
                                                type="number"
                                                value={odometerKm}
                                                onChange={(e) => setOdometerKm(Number(e.target.value))}
                                                className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Total Cost (Cents / PHP)</label>
                                            <input
                                                type="number"
                                                value={costCents}
                                                onChange={(e) => setCostCents(Number(e.target.value))}
                                                className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Servicing Notes</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={3}
                                                className="mt-1.5 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-sky-600 font-semibold text-white hover:bg-sky-700">
                                                Save Servicing Record
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Modal: Create Spare Part */}
                        {isPartCreateOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <Package className="h-4 w-4 text-sky-500" /> Add Spare Part Component
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsPartCreateOpen(false)}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <form onSubmit={handlePartCreateSubmit} className="space-y-3.5 text-xs">
                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">SKU Code</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. PART-TIRE-05"
                                                value={partSku}
                                                onChange={(e) => setPartSku(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Part Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Commercial Truck Tire 17.5"
                                                value={partName}
                                                onChange={(e) => setPartName(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                            <select
                                                value={partCategory}
                                                onChange={(e) => setPartCategory(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="Tires">Tires</option>
                                                <option value="Fluids">Fluids & Lubricants</option>
                                                <option value="Brakes">Brakes & Hydraulics</option>
                                                <option value="Engine">Engine & Transmission</option>
                                                <option value="Electrical">Electrical & Battery</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block font-semibold text-slate-700 dark:text-slate-300">In Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min={0}
                                                    value={partStockQuantity}
                                                    onChange={(e) => setPartStockQuantity(Number(e.target.value))}
                                                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-semibold text-slate-700 dark:text-slate-300">Min Reorder Level</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min={0}
                                                    value={partMinThreshold}
                                                    onChange={(e) => setPartMinThreshold(Number(e.target.value))}
                                                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Unit Cost (₱ PHP)</label>
                                            <input
                                                type="number"
                                                required
                                                min={0}
                                                step={0.01}
                                                value={partUnitCostPhp}
                                                onChange={(e) => setPartUnitCostPhp(Number(e.target.value))}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setIsPartCreateOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-sky-600 font-semibold text-white hover:bg-sky-700">
                                                Add Component
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Modal: Edit Spare Part */}
                        {editingPart && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                    <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-slate-800">
                                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <Edit2 className="h-4 w-4 text-sky-500" /> Edit Spare Part #{editingPart.sku}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setEditingPart(null)}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <form onSubmit={handlePartUpdateSubmit} className="space-y-3.5 text-xs">
                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">SKU Code</label>
                                            <input
                                                type="text"
                                                required
                                                value={partSku}
                                                onChange={(e) => setPartSku(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Part Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={partName}
                                                onChange={(e) => setPartName(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                            <select
                                                value={partCategory}
                                                onChange={(e) => setPartCategory(e.target.value)}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="Tires">Tires</option>
                                                <option value="Fluids">Fluids & Lubricants</option>
                                                <option value="Brakes">Brakes & Hydraulics</option>
                                                <option value="Engine">Engine & Transmission</option>
                                                <option value="Electrical">Electrical & Battery</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block font-semibold text-slate-700 dark:text-slate-300">In Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min={0}
                                                    value={partStockQuantity}
                                                    onChange={(e) => setPartStockQuantity(Number(e.target.value))}
                                                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-semibold text-slate-700 dark:text-slate-300">Min Reorder Level</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min={0}
                                                    value={partMinThreshold}
                                                    onChange={(e) => setPartMinThreshold(Number(e.target.value))}
                                                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 dark:text-slate-300">Unit Cost (₱ PHP)</label>
                                            <input
                                                type="number"
                                                required
                                                min={0}
                                                step={0.01}
                                                value={partUnitCostPhp}
                                                onChange={(e) => setPartUnitCostPhp(Number(e.target.value))}
                                                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setEditingPart(null)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-sky-600 font-semibold text-white hover:bg-sky-700">
                                                Update Component
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Modal: Delete Spare Part Confirmation */}
                        {deletingPart && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Spare Part Component?</h3>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-white">{deletingPart.name}</span> ({deletingPart.sku}) from inventory? This action cannot be undone.
                                    </p>
                                    <div className="mt-5 flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setDeletingPart(null)}>
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={handlePartDeleteConfirm} className="bg-rose-600 font-semibold text-white hover:bg-rose-700">
                                            Remove Part
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </FleetmanagementLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
