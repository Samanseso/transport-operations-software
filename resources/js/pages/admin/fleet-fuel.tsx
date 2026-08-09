import AppLayout from '@/layouts/app-layout';
import FleetmanagementLayout from '@/layouts/fleet-management/layout';
import { BreadcrumbItem, Driver, FuelLog, SharedData, Vehicle } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { Fuel, Plus, DollarSign, Gauge, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fleet Management',
        href: '/fleet/overview',
    },
    {
        title: 'Fuel Tracking',
        href: '/fleet/fuel',
    },
];

interface Props {
    fuelLogs: FuelLog[];
    vehicles: Vehicle[];
    drivers: Driver[];
    stats: {
        total_liters: number;
        total_cost: number;
        avg_cost_per_liter: number;
        log_count: number;
    };
    [key: string]: unknown;
}

export default function FleetFuel() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [liters, setLiters] = useState('120');
    const [totalCost, setTotalCost] = useState('7800');
    const [odometer, setOdometer] = useState('48500');

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            '/fleet/fuel',
            {
                vehicle_id: vehicleId,
                driver_id: driverId || null,
                liters: parseFloat(liters),
                total_cost: parseFloat(totalCost),
                odometer_reading: parseInt(odometer, 10),
            },
            {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    setVehicleId('');
                    setDriverId('');
                },
            }
        );
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <FleetmanagementLayout vehicles={props.vehicles}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Fleet Fuel Logs & Efficiency Inspector
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Monitor gas fill-ups, liters purchased, total fuel spend, and odometer progression.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="gap-2 bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                Log Fuel Fill
                            </Button>
                        </div>

                        {/* Fuel Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium uppercase text-slate-500">Total Liters Purchased</p>
                                    <Fuel className="h-4 w-4 text-emerald-500" />
                                </div>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                    {Number(props.stats.total_liters).toLocaleString()} L
                                </p>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium uppercase text-slate-500">Total Fuel Spend</p>
                                    <DollarSign className="h-4 w-4 text-sky-500" />
                                </div>
                                <p className="mt-2 text-2xl font-bold text-emerald-600">
                                    ₱{Number(props.stats.total_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium uppercase text-slate-500">Avg Cost / Liter</p>
                                    <Gauge className="h-4 w-4 text-amber-500" />
                                </div>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                    ₱{props.stats.avg_cost_per_liter} / L
                                </p>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium uppercase text-slate-500">Fuel Fill Entries</p>
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                </div>
                                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{props.stats.log_count}</p>
                            </div>
                        </div>

                        {/* Fuel Efficiency Trend & Anomaly Card */}
                        <div className="rounded-lg border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Fleet Fuel Efficiency & Anomaly Monitoring</h3>
                                    <p className="text-xs text-slate-500">Calculated Km/L per refuel. Flags fuel theft or engine issues when efficiency drops &gt;25%.</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Km/L Delta Engine Active
                                </span>
                            </div>
                        </div>

                        {/* Fuel Logs Data Table */}
                        <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="border-b p-4 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Recent Fleet Fuel Fill Entries</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        <tr>
                                            <th className="p-3">Vehicle</th>
                                            <th className="p-3">Driver</th>
                                            <th className="p-3">Liters (L)</th>
                                            <th className="p-3">Total Cost</th>
                                            <th className="p-3">Odometer</th>
                                            <th className="p-3">Efficiency (Km/L)</th>
                                            <th className="p-3">Fill Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                        {props.fuelLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-6 text-center text-slate-400">
                                                    No fuel fill records recorded.
                                                </td>
                                            </tr>
                                        ) : (
                                            props.fuelLogs.map((log) => (
                                                <tr
                                                    key={log.fuel_log_id}
                                                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                                        log.is_anomaly ? "bg-red-50/70 dark:bg-red-950/30" : ""
                                                    }`}
                                                >
                                                    <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">
                                                        {log.vehicle?.plate_number || log.vehicle_id}
                                                        <span className="block text-[10px] font-normal text-slate-400">
                                                            {log.vehicle?.model}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 font-medium">{log.driver?.name || log.driver_id || 'Unassigned'}</td>
                                                    <td className="p-3 font-mono font-bold text-emerald-600">
                                                        {Number(log.liters).toFixed(1)} L
                                                    </td>
                                                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                                        ₱{Number(log.total_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="p-3 font-mono">{log.odometer_reading.toLocaleString()} km</td>
                                                    <td className="p-3">
                                                        {log.efficiency_km_l ? (
                                                            <span className={`inline-flex items-center gap-1 font-mono font-bold ${
                                                                log.is_anomaly ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"
                                                            }`}>
                                                                {log.efficiency_km_l} Km/L
                                                                {log.is_anomaly && (
                                                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                        ⚠️ ANOMALY (&gt;25% DROP)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">Baseline</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-slate-500">{log.filled_at || log.created_at}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal for Fuel Fill Entry */}
                        {isCreateOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Fuel Purchase</h3>
                                    <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Select Vehicle</label>
                                            <select
                                                required
                                                value={vehicleId}
                                                onChange={(e) => setVehicleId(e.target.value)}
                                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                            >
                                                <option value="">-- Select Vehicle --</option>
                                                {props.vehicles.map((v) => (
                                                    <option key={v.vehicle_id} value={v.vehicle_id}>
                                                        {v.plate_number} ({v.model})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Assigned Driver</label>
                                            <select
                                                value={driverId}
                                                onChange={(e) => setDriverId(e.target.value)}
                                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                            >
                                                <option value="">-- Optional Driver --</option>
                                                {props.drivers.map((d) => (
                                                    <option key={d.driver_id} value={d.driver_id}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block font-medium text-slate-700 dark:text-slate-300">Liters (L)</label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    required
                                                    value={liters}
                                                    onChange={(e) => setLiters(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium text-slate-700 dark:text-slate-300">Total Cost (₱)</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    value={totalCost}
                                                    onChange={(e) => setTotalCost(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Current Odometer (km)</label>
                                            <Input
                                                type="number"
                                                required
                                                value={odometer}
                                                onChange={(e) => setOdometer(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                                Save Fuel Log
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </FleetmanagementLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
