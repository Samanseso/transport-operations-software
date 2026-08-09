import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Driver, SharedData, Vehicle, VehicleInspection } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { ClipboardCheck, ShieldCheck, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver Tasks',
        href: '/tasks',
    },
    {
        title: 'Pre-Trip Inspection',
        href: '/driver/inspection',
    },
];

interface Props {
    driver: Driver | null;
    assignedVehicle: Vehicle | null;
    vehicles: Vehicle[];
    recentInspections: VehicleInspection[];
    [key: string]: unknown;
}

export default function DriverInspection() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [vehicleId, setVehicleId] = useState(props.assignedVehicle?.vehicle_id || props.vehicles[0]?.vehicle_id || '');
    const [driverId, setDriverId] = useState(props.driver?.driver_id || 'DRV-001');
    const [tiresOk, setTiresOk] = useState(true);
    const [brakesOk, setBrakesOk] = useState(true);
    const [lightsOk, setLightsOk] = useState(true);
    const [fuelLevel, setFuelLevel] = useState('Full');
    const [odometer, setOdometer] = useState('48500');
    const [defects, setDefects] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post('/driver/inspection', {
            vehicle_id: vehicleId,
            driver_id: driverId,
            tires_ok: tiresOk,
            brakes_ok: brakesOk,
            lights_ok: lightsOk,
            fuel_level: fuelLevel,
            odometer_reading: parseInt(odometer, 10),
            defects_noted: defects,
        });
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-md space-y-6 p-4">
                    <div className="rounded-xl border bg-gradient-to-r from-sky-900 to-slate-900 p-5 text-white shadow-md">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-sky-400" />
                            <div>
                                <h2 className="text-lg font-bold">Pre-Trip Safety Inspection</h2>
                                <p className="text-xs text-slate-300">Mandatory vehicle safety check before starting your shift.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs">
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Assigned Vehicle Truck</label>
                            <select
                                required
                                value={vehicleId}
                                onChange={(e) => setVehicleId(e.target.value)}
                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                            >
                                {props.vehicles.map((v) => (
                                    <option key={v.vehicle_id} value={v.vehicle_id}>
                                        {v.plate_number} ({v.model})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Safety Toggles */}
                        <div className="space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                            <h4 className="font-bold text-slate-900 dark:text-white">Component Checklist</h4>

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Tires & Pressure Condition</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setTiresOk(!tiresOk)}
                                    className={`h-7 px-3 text-[11px] font-bold ${tiresOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {tiresOk ? 'PASSED OK' : 'DEFECTIVE'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Brakes & Fluid Pressure</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setBrakesOk(!brakesOk)}
                                    className={`h-7 px-3 text-[11px] font-bold ${brakesOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {brakesOk ? 'PASSED OK' : 'DEFECTIVE'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Headlights & Signals</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setLightsOk(!lightsOk)}
                                    className={`h-7 px-3 text-[11px] font-bold ${lightsOk ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {lightsOk ? 'PASSED OK' : 'DEFECTIVE'}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Current Fuel Gauge Level</label>
                            <select
                                value={fuelLevel}
                                onChange={(e) => setFuelLevel(e.target.value)}
                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                            >
                                <option value="Full">Full Tank (100%)</option>
                                <option value="3/4 Tank">3/4 Tank (75%)</option>
                                <option value="Half Tank">Half Tank (50%)</option>
                                <option value="1/4 Tank">1/4 Tank (25%)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Odometer Reading (km)</label>
                            <Input
                                type="number"
                                required
                                value={odometer}
                                onChange={(e) => setOdometer(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Notes / Reported Defects</label>
                            <textarea
                                value={defects}
                                onChange={(e) => setDefects(e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                placeholder="Describe any scratch, tire issue, or warning light..."
                            />
                        </div>

                        <Button type="submit" className="h-12 w-full bg-sky-600 text-sm font-bold hover:bg-sky-700">
                            Submit Inspection & Start Shift
                        </Button>
                    </form>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
