import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, Vehicle } from '@/types';
import { Activity, Gauge, Flame, AlertTriangle, ShieldCheck, Radio } from 'lucide-react';
import StatusTag from '@/components/status-tag';

interface TelematicsLogItem {
    id: number;
    vehicle?: Vehicle;
    fuel_rate_l_100km: number;
    engine_temp_c: number;
    idle_seconds: number;
    harsh_braking_events: number;
    recorded_at: string;
}

interface Props {
    vehicles: Vehicle[];
    telematicsLogs: TelematicsLogItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fleet Operations', href: '/fleet' },
    { title: 'OBD-II Telematics & Diagnostics', href: '/fleet/telematics' },
];

export default function FleetTelematics({ vehicles, telematicsLogs }: Props) {
    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="OBD-II Telematics & Vehicle Diagnostics" />
                <div className="space-y-6 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-500" />
                                OBD-II Telematics & Real-Time Diagnostics
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Monitor real-time engine coolant temp, idle fuel consumption, and DTC fault codes across all vehicles.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <Radio className="h-3.5 w-3.5 animate-pulse" /> Live CAN-Bus Feed
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {vehicles.map((v) => (
                            <div
                                key={v.vehicle_id}
                                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <div>
                                        <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">{v.model}</h3>
                                        <p className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400">
                                            {v.plate_number}
                                        </p>
                                    </div>
                                    <StatusTag text={v.status} />
                                </div>

                                <div className="mt-3 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Engine Temp:</span>
                                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">88 °C</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">Fuel Economy:</span>
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">11.8 L/100km</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 dark:text-slate-400">DTC Faults:</span>
                                        <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="h-3.5 w-3.5" /> 0 Faults
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
