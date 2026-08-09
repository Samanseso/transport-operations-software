import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem } from '@/types';
import { Building2, ScanLine, Truck, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HubItem {
    id: number;
    hub_code: string;
    name: string;
    type: string;
    address: string;
    manager_name?: string;
    scans_count?: number;
    outbound_manifests_count?: number;
    inbound_manifests_count?: number;
}

interface ScanItem {
    id: number;
    waybill_number: string;
    scan_type: string;
    sorting_bin?: string;
    scanned_at: string;
    hub?: HubItem;
}

interface Props {
    hubs: HubItem[];
    recentScans: ScanItem[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Logistics Hubs', href: '/hub' }];

export default function HubDashboard({ hubs, recentScans }: Props) {
    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Sorting Hubs & Cross-Docking" />
                <div className="space-y-6 p-4 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-sky-500" />
                                Parcel Sorting Hubs & Cross-Docking
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Manage origin sorting stations, intermediate hubs, and line-haul transfers.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs">
                                <Link href="/hub/scan">
                                    <ScanLine className="h-4 w-4" /> Laser Scanner
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="gap-2 text-xs">
                                <Link href="/hub/manifests">
                                    <ArrowRightLeft className="h-4 w-4" /> Line-Haul Manifests
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stations Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {hubs.map((hub) => (
                            <div
                                key={hub.id}
                                className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        {hub.hub_code}
                                    </span>
                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {hub.type.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{hub.name}</h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{hub.address}</p>

                                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center text-xs dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase text-slate-400">Scans</p>
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{hub.scans_count || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase text-slate-400">Outbound</p>
                                        <p className="font-mono font-bold text-sky-600 dark:text-sky-400">
                                            {hub.outbound_manifests_count || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase text-slate-400">Inbound</p>
                                        <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            {hub.inbound_manifests_count || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Sorting Scan Activity Table Container */}
                    <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b p-4 border-slate-100 dark:border-slate-800">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Live Hub Sorting Scan Stream</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <tr>
                                        <th className="p-3">Waybill No</th>
                                        <th className="p-3">Scan Type</th>
                                        <th className="p-3">Hub & Sorting Bin</th>
                                        <th className="p-3">Scanned Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                    {recentScans.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                                                {scan.waybill_number}
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                    {scan.scan_type}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-medium text-slate-900 dark:text-white">{scan.hub?.name}</span> · Bin:{' '}
                                                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                                                    {scan.sorting_bin}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-slate-500">{scan.scanned_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
