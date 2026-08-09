import React, { useState } from 'react';
import { usePage, Form, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, SharedData, Vehicle } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import VehicleCard from '@/components/vehicle-card';
import { Truck, Weight, AlertTriangle, ShieldCheck } from 'lucide-react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';

export default function FleetAllocation() {
    const page = usePage<
        SharedData & {
            date: string;
            time: string;
            cargo_type: string;
            cargo_weight_kg: number;
            selected_vehicle_id?: string;
            availableVehicles: Vehicle[];
            unavailableVehicles: Vehicle[];
            edit_mode?: boolean;
            edit_reservation_id?: string;
        }
    >();

    const { props } = page;
    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservations', href: '/reservations' },
        {
            title: editMode ? 'Edit Waybill' : 'Step 2: Fleet Allocation',
            href: '/reservations/create/step/2',
        },
    ];

    const [cargoWeightKg, setCargoWeightKg] = useState<number>(props.cargo_weight_kg || 100);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>(props.selected_vehicle_id || '');

    const parseCapacityKg = (capacityStr?: string): number => {
        if (!capacityStr) return 1500;
        const match = capacityStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 1500;
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <Form
                        {...ReservationController.processStep2.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-8 md:max-w-4xl">
                                <div>
                                    <HeadingSmall
                                        title="Step 2: Cargo Specifications & Fleet Allocation"
                                        description="Enter payload weight to filter eligible fleet trucks and assign a capable vehicle."
                                    />
                                </div>

                                {/* Cargo Specs Block */}
                                <div className="rounded-xl border bg-slate-50 p-5 space-y-4 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                        <Weight className="h-5 w-5" />
                                        <h3 className="font-bold text-sm">Cargo & Schedule Specifications</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="date">Scheduled Dispatch Date *</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                name="date"
                                                defaultValue={props.date}
                                                required
                                            />
                                            <InputError message={errors.date} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Requested Departure Time *</Label>
                                            <Input
                                                id="time"
                                                type="time"
                                                name="time"
                                                defaultValue={props.time}
                                                required
                                            />
                                            <InputError message={errors.time} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cargo_type">Cargo Classification</Label>
                                            <Select name="cargo_type" defaultValue={props.cargo_type || 'General Freight'}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Cargo Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Freight">📦 General Freight</SelectItem>
                                                    <SelectItem value="Dry Goods">🧱 Dry Goods & Construction</SelectItem>
                                                    <SelectItem value="Cold Chain">❄️ Cold Chain / Perishables</SelectItem>
                                                    <SelectItem value="Fragile">🍷 Fragile / Glassware</SelectItem>
                                                    <SelectItem value="Heavy Equipment">🏗️ Heavy Equipment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="cargo_weight_kg">Estimated Cargo Weight (kg) *</Label>
                                            <Input
                                                id="cargo_weight_kg"
                                                type="number"
                                                min="1"
                                                name="cargo_weight_kg"
                                                value={cargoWeightKg}
                                                onChange={(e) => setCargoWeightKg(parseInt(e.target.value, 10) || 0)}
                                                placeholder="e.g. 500"
                                                required
                                            />
                                            <InputError message={errors.cargo_weight_kg} />
                                        </div>
                                    </div>
                                </div>

                                {/* Fleet Truck Allocation Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                            <Truck className="h-5 w-5 text-emerald-600" />
                                            Fleet Allocation (Filtered for {cargoWeightKg} kg Cargo)
                                        </h3>
                                        <span className="text-xs text-slate-500">Select 1 vehicle for this dispatch</span>
                                    </div>

                                    <input type="hidden" name="vehicle_id" value={selectedVehicleId} />
                                    <InputError message={errors.vehicle_id} />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {props.availableVehicles.map((vehicle) => {
                                            const capacityKg = parseCapacityKg(vehicle.capacity);
                                            const isOverweight = cargoWeightKg > capacityKg;
                                            const isSelected = selectedVehicleId === vehicle.vehicle_id;

                                            return (
                                                <div
                                                    key={vehicle.vehicle_id}
                                                    onClick={() => !isOverweight && setSelectedVehicleId(vehicle.vehicle_id)}
                                                    className={`relative rounded-xl border p-4 transition-all ${
                                                        isOverweight
                                                            ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-950 border-rose-300'
                                                            : isSelected
                                                            ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500 cursor-pointer dark:bg-emerald-950/40'
                                                            : 'bg-white hover:border-slate-400 cursor-pointer dark:bg-slate-900'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{vehicle.model}</h4>
                                                            <span className="font-mono text-xs text-slate-500">Plate: {vehicle.plate_number}</span>
                                                        </div>
                                                        <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                                            {vehicle.capacity || '1500 kg'}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                                        Driver: <span className="font-semibold text-slate-900 dark:text-white">{vehicle.driver?.name || 'Assigned Driver'}</span>
                                                    </p>

                                                    {isOverweight && (
                                                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                                                            <AlertTriangle className="h-3.5 w-3.5" />
                                                            Capacity Exceeded (Max {capacityKg} kg)
                                                        </div>
                                                    )}

                                                    {isSelected && !isOverweight && (
                                                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                                            <ShieldCheck className="h-3.5 w-3.5" />
                                                            Selected for Dispatch
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/reservations/create/step/1">← Back to Route</Link>
                                    </Button>

                                    <Button disabled={processing || !selectedVehicleId} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        Next: Consignee Contacts →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
