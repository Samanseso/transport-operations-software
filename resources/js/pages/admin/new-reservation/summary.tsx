import React from 'react';
import { Form, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, User, Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock3, MapPin, Package, Truck, UserRound, DollarSign, Send, Navigation, FileCheck } from 'lucide-react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';

interface Waypoint {
    address: string;
    latlng: string;
    consignee_name?: string;
    consignee_phone?: string;
    instructions?: string;
}

type SummaryData = {
    customer_id: string;
    date: string;
    time: string | null;
    vehicle_id: string | null;
    pickup_address: string | null;
    pickup_latlng: string | null;
    dropoff_address: string | null;
    dropoff_latlng: string | null;
    waypoints?: Waypoint[];
    service_type: string | null;
    cargo_details: string | null;
    cargo_type?: string | null;
    cargo_weight_kg?: number;
    max_capacity_kg?: number;
    special_instructions: string | null;
    base_fare_cents?: number;
    per_km_rate_applied_cents?: number;
    multi_stop_surcharge_cents?: number;
    total_fare_cents?: number;
};

export default function Summary() {
    const { props } = usePage<{
        summary: SummaryData;
        selectedVehicle?: Vehicle | null;
        customer?: Pick<User, 'id' | 'name' | 'email'> | null;
        edit_mode?: boolean;
        edit_reservation_id?: string;
    }>();

    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);
    const editId = props.edit_reservation_id;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservations', href: '/reservations' },
        {
            title: editMode ? 'Edit Waybill' : 'Step 4: Fare Review & Dispatch',
            href: '/reservations/create/step/4',
        },
    ];

    const backHref = editMode ? `/reservations/${editId}/edit/step/3` : '/reservations/create/step/3';
    const summary = props.summary;
    const selectedVehicle = props.selectedVehicle;
    const customer = props.customer;

    const waypoints = summary.waypoints || [];
    const baseFareCents = summary.base_fare_cents || 150000;
    const distanceFareCents = (summary.per_km_rate_applied_cents || 4500) * 15;
    const multiStopSurchargeCents = summary.multi_stop_surcharge_cents || 0;
    const totalFareCents = summary.total_fare_cents || (baseFareCents + distanceFareCents + multiStopSurchargeCents);

    const formatCurrency = (cents: number) => '₱' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <div className="space-y-6">
                        <div className="max-w-3xl space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">Step 4: Itemized Fare Matrix & Waybill Dispatch</h2>
                            <p className="text-sm text-muted-foreground">
                                Review the multi-stop route, cargo payload matching, and financial invoice before generating the waybill.
                            </p>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-6">
                                {/* Route & Waypoints Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                            <Navigation className="size-5" />
                                            Multi-Stop Route & Consignees
                                        </CardTitle>
                                        <CardDescription>Pick-up origin and sequential dropoff destinations.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Pick-Up Origin</p>
                                            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{summary.pickup_address}</p>
                                            <p className="mt-1 text-xs text-slate-500">{summary.pickup_latlng}</p>
                                        </div>

                                        {waypoints.map((wp, idx) => (
                                            <div key={idx} className="rounded-lg border p-4 text-xs space-y-2 dark:border-slate-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="rounded bg-sky-100 px-2 py-0.5 font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                        Dropoff Stop #{idx + 1}
                                                    </span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{wp.consignee_name || 'Receiver'} ({wp.consignee_phone || 'No phone'})</span>
                                                </div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{wp.address}</p>
                                                {wp.instructions && (
                                                    <p className="text-slate-500 italic">Gate Note: {wp.instructions}</p>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Vehicle & Schedule Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="size-5 text-indigo-600" />
                                            Assigned Fleet Truck & Schedule
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-lg border p-4">
                                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Schedule</p>
                                            <p className="mt-2 font-medium">{summary.date} at {summary.time}</p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Assigned Truck</p>
                                            <p className="mt-2 font-semibold text-slate-900 dark:text-white">{selectedVehicle?.model || summary.vehicle_id || 'No truck selected'}</p>
                                            <p className="text-xs text-slate-500">Plate: {selectedVehicle?.plate_number || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                {/* Itemized Fare Matrix */}
                                <Card className="border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                                            <DollarSign className="size-5" />
                                            Itemized Financial Fare Matrix
                                        </CardTitle>
                                        <CardDescription>Calculated billing breakdown for this waybill dispatch.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-xs">
                                        <div className="flex justify-between border-b pb-2 text-slate-700 dark:text-slate-300">
                                            <span>Base Fare ({summary.service_type}):</span>
                                            <span className="font-mono font-semibold">{formatCurrency(baseFareCents)}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 text-slate-700 dark:text-slate-300">
                                            <span>Distance & Route Fare (~15 km):</span>
                                            <span className="font-mono font-semibold">{formatCurrency(distanceFareCents)}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2 text-slate-700 dark:text-slate-300">
                                            <span>Multi-Stop Waypoint Surcharge ({Math.max(0, waypoints.length - 1)} Extra Stops):</span>
                                            <span className="font-mono font-semibold">{formatCurrency(multiStopSurchargeCents)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 text-base font-bold text-slate-900 dark:text-white">
                                            <span>Total Billing Fare:</span>
                                            <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(totalFareCents)}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Account Owner */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <UserRound className="size-5" />
                                            Corporate Account Tag
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-lg border p-4 text-xs">
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{customer?.name || 'Client Account'}</p>
                                            <p className="text-slate-500">{customer?.email}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Form
                                    {...ReservationController.processStep5.form()}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                >
                                    {({ processing }) => (
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <Button type="button" variant="outline" asChild>
                                                <Link href={backHref} preserveState={false}>
                                                    ← Back to Step 3
                                                </Link>
                                            </Button>

                                            <Button disabled={processing} className="sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                                <Send className="mr-2 h-4 w-4" />
                                                {processing ? 'Generating Waybill...' : editMode ? 'Update Waybill Dispatch' : 'Generate Waybill & Dispatch'}
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </div>
                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
