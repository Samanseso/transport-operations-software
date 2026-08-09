import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, Reservation } from '@/types';
import StatusTag from '@/components/status-tag';
import { Package, Plus, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    reservations: Reservation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customer Portal', href: '/client/dashboard' },
];

export default function CustomerDashboard({ reservations }: Props) {
    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Corporate Account Delivery Portal" />
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Corporate Client Logistics Portal</h2>
                            <p className="text-sm text-slate-500">Track corporate shipments, place new bookings, and import bulk delivery manifests.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                                <Link href="/reservations/create/step/1">
                                    <Plus className="mr-2 h-4 w-4" /> Book New Waybill
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/client/bulk-waybill">
                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Bulk CSV Manifest Import
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Shipments Table */}
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Account Waybill Registry ({reservations.length} Orders)</h3>
                        <table className="w-full text-left text-xs border">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3 border">Waybill Code</th>
                                    <th className="p-3 border">Destination</th>
                                    <th className="p-3 border">Date & Time</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Tracking</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-slate-800 dark:text-slate-200">
                                {reservations.map((r) => (
                                    <tr key={r.reservation_id}>
                                        <td className="p-3 border font-mono font-bold">{r.waybill_number || r.reservation_id.slice(0, 8)}</td>
                                        <td className="p-3 border font-semibold">{r.dropoff_address}</td>
                                        <td className="p-3 border">{r.date} {r.time}</td>
                                        <td className="p-3 border"><StatusTag text={r.status} /></td>
                                        <td className="p-3 border">
                                            <a href={`/track/${r.waybill_number || r.reservation_id}`} target="_blank" className="text-sky-600 hover:underline flex items-center gap-1 font-semibold">
                                                Public Track <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
