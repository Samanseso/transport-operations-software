import React from 'react';
import { Head } from '@inertiajs/react';
import { Reservation } from '@/types';
import StatusTag from '@/components/status-tag';
import { Truck, MapPin, Package, Calendar, Clock, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

interface Props {
    reservation: Reservation;
}

export default function PublicTrack({ reservation }: Props) {
    const waybillCode = reservation.waybill_number || `WAYBILL-${reservation.reservation_id.slice(0, 6).toUpperCase()}`;

    const checkpoints = [
        { key: 'PENDING', label: 'Order Placed' },
        { key: 'ASSIGNED', label: 'Driver Assigned' },
        { key: 'DRIVER_EN_ROUTE_TO_PICKUP', label: 'En Route to Pickup' },
        { key: 'CARGO_LOADED', label: 'Cargo Loaded' },
        { key: 'IN_TRANSIT', label: 'In Transit' },
        { key: 'DELIVERED', label: 'Delivered' },
    ];

    const currentStatusIndex = checkpoints.findIndex((c) => c.key === reservation.status);
    const isCompleted = reservation.status === 'DELIVERED';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title={`Track Waybill ${waybillCode}`} />

            {/* Header Bar */}
            <header className="border-b bg-slate-900 px-6 py-4 text-white shadow-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-500 p-2 text-white shadow">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Michael Archangel Fleet Operations</h1>
                            <p className="text-xs text-slate-400">Public Cargo & Parcel Tracking Portal</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] uppercase text-slate-400">Waybill Tracking Code</span>
                        <span className="font-mono text-base font-bold text-emerald-400">{waybillCode}</span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
                {/* Status Hero Card */}
                <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Waybill #{waybillCode}</h2>
                                <StatusTag text={reservation.status} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Scheduled Date: <span className="font-semibold">{reservation.date}</span> at{' '}
                                <span className="font-semibold">{reservation.time}</span>
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-100 p-3 text-right text-xs dark:bg-slate-800">
                            <p className="text-slate-500">Service Category</p>
                            <p className="font-bold text-slate-900 dark:text-white">{reservation.service_type}</p>
                        </div>
                    </div>

                    {/* Operational Checkpoints Progress */}
                    <div className="mt-8 border-t pt-6 dark:border-slate-800">
                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Live Delivery Progress</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                            {checkpoints.map((step, idx) => {
                                const isPassed = currentStatusIndex >= idx || isCompleted;
                                const isCurrent = currentStatusIndex === idx;

                                return (
                                    <div
                                        key={step.key}
                                        className={`rounded-xl border p-3 text-center transition-all ${
                                            isCurrent
                                                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 dark:bg-emerald-950/40'
                                                : isPassed
                                                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300'
                                                : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900'
                                        }`}
                                    >
                                        <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-xs dark:bg-black">
                                            {isPassed ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-semibold">{step.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Route & Address Information */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <MapPin className="h-5 w-5 text-emerald-500" />
                            <h3 className="font-bold">Origin & Destination Route</h3>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Pick-up Location</span>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{reservation.pickup_address}</p>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                <span className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400">Drop-off Destination</span>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{reservation.dropoff_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Specifications & POD Verification */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Package className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-bold">Cargo & Payload Specifications</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-xl border p-3 dark:border-slate-800">
                                    <p className="text-slate-500">Cargo Category</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{reservation.cargo_type || 'General Freight'}</p>
                                </div>
                                <div className="rounded-xl border p-3 dark:border-slate-800">
                                    <p className="text-slate-500">Weight & Capacity</p>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {reservation.cargo_weight_kg || 0} kg / {reservation.max_capacity_kg || 1500} kg
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Proof of Delivery (POD) Sign-off */}
                        {isCompleted && (
                            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40">
                                <div className="mb-3 flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
                                    <FileCheck className="h-5 w-5" />
                                    <h3 className="font-bold">Official Proof of Delivery (POD) Signed</h3>
                                </div>
                                <div className="space-y-2 text-xs text-emerald-900 dark:text-emerald-300">
                                    <p>
                                        Recipient: <span className="font-bold">{reservation.pod_recipient_name || reservation.customer?.name}</span>
                                    </p>
                                    <p>
                                        Delivered Date:{' '}
                                        <span className="font-semibold">{reservation.pod_signed_at || reservation.updated_at}</span>
                                    </p>

                                    {reservation.pod_signature_url && (
                                        <div className="mt-3 rounded-xl border bg-white p-3 dark:bg-black">
                                            <p className="text-[10px] text-slate-400 uppercase">Digital E-Signature Stamp</p>
                                            <img
                                                src={reservation.pod_signature_url}
                                                alt="Customer Signature"
                                                className="mt-2 max-h-24 mx-auto object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
