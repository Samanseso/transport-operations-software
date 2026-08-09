import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import FleetmanagementLayout from '@/layouts/fleet-management/layout';
import { BreadcrumbItem, Driver, SharedData, SystemLogEntry, Vehicle } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fleet Management',
        href: '',
    },
];

const FleetManagement = () => {
    const props = usePage<{ vehicles: Vehicle[]; selectedVehicle?: Vehicle; availableDrivers: Driver[]; recentVehicleLogs: SystemLogEntry[] }>()
        .props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const [plateNumber, setPlateNumber] = useState('');
    const [model, setModel] = useState('');
    const [capacity, setCapacity] = useState('');
    const [status, setStatus] = useState('AVAILABLE');
    const [driverId, setDriverId] = useState<string>('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [vinNumber, setVinNumber] = useState('');
    const [registrationExpiresAt, setRegistrationExpiresAt] = useState('');
    const [insuranceExpiresAt, setInsuranceExpiresAt] = useState('');

    const stats = useMemo(() => {
        const total = props.vehicles.length;
        const available = props.vehicles.filter((v) => v.status === 'AVAILABLE').length;
        const assigned = props.vehicles.filter((v) => v.driver_id).length;
        const unassigned = total - assigned;
        const maintenance = props.vehicles.filter((v) => v.status === 'IN_MAINTENANCE' || v.status === 'MAINTENANCE').length;
        const unsafe = props.vehicles.filter((v) => v.status === 'UNSAFE_FOR_DRIVE').length;
        return { total, available, assigned, unassigned, maintenance, unsafe };
    }, [props.vehicles]);

    const expiringVehicles = useMemo(() => {
        const now = new Date();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        return props.vehicles.filter((v) => {
            if (v.status === 'UNSAFE_FOR_DRIVE') return true;
            if (v.registration_expires_at) {
                const regDate = new Date(v.registration_expires_at);
                if (regDate.getTime() - now.getTime() <= thirtyDaysMs) return true;
            }
            if (v.insurance_expires_at) {
                const insDate = new Date(v.insurance_expires_at);
                if (insDate.getTime() - now.getTime() <= thirtyDaysMs) return true;
            }
            return false;
        });
    }, [props.vehicles]);

    const last7DaysLabels = useMemo(() => {
        const labels: string[] = [];
        const today = new Date();
        for (let i = 0; i < 7; i += 1) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
        }
        return labels;
    }, []);

    const handleCreateVehicle = (event: FormEvent) => {
        event.preventDefault();

        router.post(
            '/fleet',
            {
                plate_number: plateNumber,
                vin_number: vinNumber || null,
                model,
                capacity,
                registration_expires_at: registrationExpiresAt || null,
                insurance_expires_at: insuranceExpiresAt || null,
                status,
                driver_id: driverId || null,
            },
            {
                onSuccess: () => {
                    setPlateNumber('');
                    setVinNumber('');
                    setModel('');
                    setCapacity('');
                    setRegistrationExpiresAt('');
                    setInsuranceExpiresAt('');
                    setStatus('AVAILABLE');
                    setDriverId('');
                    setIsCreateOpen(false);
                },
            },
        );
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <FleetmanagementLayout vehicles={props.vehicles} selectedVehicle={props.selectedVehicle}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Fleet Management & Asset Directory</h2>
                            </div>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </div>

                        {/* Lifecycle Expiry & Safety Lockout Banners */}
                        {expiringVehicles.length > 0 && (
                            <div className="space-y-2">
                                {expiringVehicles.map((v) => {
                                    const isUnsafe = v.status === 'UNSAFE_FOR_DRIVE';
                                    return (
                                        <div
                                            key={v.vehicle_id}
                                            className={`flex items-center justify-between rounded-xl border p-4 text-xs font-semibold shadow-sm ${
                                                isUnsafe
                                                    ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
                                                    : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="rounded-md bg-white/80 px-2 py-1 font-mono uppercase dark:bg-black/40">
                                                    #{v.plate_number}
                                                </span>
                                                <span>
                                                    {isUnsafe
                                                        ? '⚠️ SAFETY LOCKOUT: Marked UNSAFE FOR DRIVE due to failed pre-trip inspection.'
                                                        : '⚠️ ASSET EXPIRY WARNING: Registration or Insurance expiring within 30 days.'}
                                                </span>
                                            </div>
                                            <span className="text-opacity-80 font-normal">
                                                Reg: {v.registration_expires_at || 'N/A'} · Ins: {v.insurance_expires_at || 'N/A'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Total Vehicles</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Available</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.available}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Assigned</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.assigned}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Unassigned</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.unassigned}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Maintenance</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.maintenance}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-xs font-bold font-medium text-rose-500 uppercase">Unsafe / Locked</p>
                                <p className="mt-2 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.unsafe}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <p className="font-semibold text-slate-900 dark:text-white">Utilization Trend</p>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Last 7 days</span>
                                </div>
                                <div className="mt-4 grid grid-cols-7 gap-2">
                                    {[32, 45, 38, 62, 71, 58, 66].map((value, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div className="h-64 w-5 rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="w-full rounded-full bg-sky-500 transition-all duration-300"
                                                    style={{ height: `${value}%` }}
                                                />
                                            </div>
                                            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                                                {last7DaysLabels[index] ?? ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <p className="font-semibold text-slate-900 dark:text-white">Status Mix</p>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Today</span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {[
                                            { label: 'Available', value: stats.available, color: 'bg-emerald-500' },
                                            { label: 'Assigned', value: stats.assigned, color: 'bg-sky-500' },
                                            { label: 'Maintenance', value: stats.maintenance, color: 'bg-amber-500' },
                                            { label: 'Unsafe for Drive', value: stats.unsafe, color: 'bg-rose-600' },
                                        ].map((item) => {
                                            const percent = stats.total ? Math.round((item.value / stats.total) * 100) : 0;
                                            return (
                                                <div key={item.label} className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{item.label}</span>
                                                        <span className="font-mono font-medium">
                                                            {item.value} · {percent}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    {/* Recent Logs of vehicles */}
                                    <div className="rounded-lg border bg-white p-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold">Recent Vehicle Logs</p>
                                            <span className="text-xs text-gray-500">Latest 5</span>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            {props.recentVehicleLogs.length === 0 && <p className="text-sm text-gray-500">No recent vehicle logs.</p>}
                                            {props.recentVehicleLogs.map((log, index) => (
                                                <div
                                                    key={`${log.datelog}-${log.timelog}-${index}`}
                                                    className="flex items-start justify-between gap-3"
                                                >
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700">{log.description}</p>
                                                        <p className="text-xs text-gray-400">{log.performed_to}</p>
                                                    </div>
                                                    <div className="text-right text-[11px] text-gray-400">
                                                        <div>{log.datelog}</div>
                                                        <div>{log.timelog}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isCreateOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Add Vehicle</h2>
                                    <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                                        Close
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">Create a vehicle record with plate, VIN, and expiry dates.</p>

                                <form onSubmit={handleCreateVehicle} className="mt-4 space-y-3 text-xs">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">Plate Number *</label>
                                            <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">VIN Number</label>
                                            <Input value={vinNumber} onChange={(e) => setVinNumber(e.target.value)} placeholder="17-character VIN" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">Model *</label>
                                            <Input value={model} onChange={(e) => setModel(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">Capacity</label>
                                            <Input
                                                value={capacity}
                                                onChange={(e) => setCapacity(e.target.value)}
                                                placeholder="e.g. 1500 kg / 4 pax"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">Registration Expiry</label>
                                            <Input
                                                type="date"
                                                value={registrationExpiresAt}
                                                onChange={(e) => setRegistrationExpiresAt(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium text-gray-600 dark:text-gray-300">Insurance Expiry</label>
                                            <Input type="date" value={insuranceExpiresAt} onChange={(e) => setInsuranceExpiresAt(e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-medium text-gray-600 dark:text-gray-300">Status</label>
                                        <select
                                            className="mt-1 w-full rounded-md border p-2 text-xs dark:bg-slate-800"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="AVAILABLE">AVAILABLE</option>
                                            <option value="IN_USE">IN_USE</option>
                                            <option value="IN_MAINTENANCE">IN_MAINTENANCE</option>
                                            <option value="UNSAFE_FOR_DRIVE">UNSAFE_FOR_DRIVE</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="font-medium text-gray-600 dark:text-gray-300">Driver</label>
                                        <select
                                            className="mt-1 w-full rounded-md border p-2 text-xs dark:bg-slate-800"
                                            value={driverId}
                                            onChange={(e) => setDriverId(e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {props.availableDrivers.map((driver) => (
                                                <option key={driver.driver_id} value={driver.driver_id}>
                                                    {driver.name} ({driver.driver_id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Create Vehicle</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </FleetmanagementLayout>
            </AppLayout>
        </SidebarProvider>
    );
};

export default FleetManagement;
