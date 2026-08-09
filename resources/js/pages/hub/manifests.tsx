import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, Vehicle } from '@/types';
import { ArrowRightLeft, Truck, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Hub {
    id: number;
    hub_code: string;
    name: string;
}

interface Manifest {
    id: number;
    manifest_code: string;
    origin_hub?: Hub;
    destination_hub?: Hub;
    vehicle?: Vehicle;
    status: string;
    waybills: string[];
    dispatched_at: string;
}

interface Props {
    hubs: Hub[];
    vehicles: Vehicle[];
    manifests: Manifest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Logistics Hubs', href: '/hub' },
    { title: 'Line-Haul Manifests', href: '/hub/manifests' },
];

export default function HubManifests({ hubs, vehicles, manifests }: Props) {
    const [originHub, setOriginHub] = useState(hubs[0]?.id || 1);
    const [destHub, setDestHub] = useState(hubs[1]?.id || 2);
    const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.vehicle_id || '');
    const [waybillCodes, setWaybillCodes] = useState('MA-2026-8X912, MA-2026-9A82F');

    const handleCreateManifest = (e: React.FormEvent) => {
        e.preventDefault();

        const waybillsArray = waybillCodes.split(',').map((w) => w.trim()).filter(Boolean);

        router.post(
            '/hub/manifests',
            {
                origin_hub_id: originHub,
                destination_hub_id: destHub,
                vehicle_id: selectedVehicle,
                waybills: waybillsArray,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setWaybillCodes('');
                },
            }
        );
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Line-Haul Trunkline Manifests" />
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowRightLeft className="h-6 w-6 text-sky-600" />
                            Trunkline Line-Haul Transfer Manifests
                        </h2>
                        <p className="text-sm text-slate-500">Dispatch bulk parcel bags between sorting hubs and last-mile stations.</p>
                    </div>

                    {/* Create Manifest Form */}
                    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Plus className="h-4 w-4 text-emerald-600" /> Dispatch New Line-Haul Manifest
                        </h3>

                        <form onSubmit={handleCreateManifest} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block font-bold mb-1">Origin Station</label>
                                    <select
                                        value={originHub}
                                        onChange={(e) => setOriginHub(Number(e.target.value))}
                                        className="w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        {hubs.map((h) => (
                                            <option key={h.id} value={h.id}>
                                                {h.hub_code} - {h.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold mb-1">Destination Station</label>
                                    <select
                                        value={destHub}
                                        onChange={(e) => setDestHub(Number(e.target.value))}
                                        className="w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        {hubs.map((h) => (
                                            <option key={h.id} value={h.id}>
                                                {h.hub_code} - {h.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold mb-1">Line-Haul Truck</label>
                                    <select
                                        value={selectedVehicle}
                                        onChange={(e) => setSelectedVehicle(e.target.value)}
                                        className="w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        {vehicles.map((v) => (
                                            <option key={v.vehicle_id} value={v.vehicle_id}>
                                                {v.model} ({v.plate_number})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold mb-1">Waybill Codes (Comma-separated)</label>
                                <input
                                    type="text"
                                    value={waybillCodes}
                                    onChange={(e) => setWaybillCodes(e.target.value)}
                                    className="w-full rounded-md border p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
                                    placeholder="MA-2026-XXXXX, MA-2026-YYYYY"
                                    required
                                />
                            </div>

                            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                                Dispatch Line-Haul Manifest
                            </Button>
                        </form>
                    </div>

                    {/* Active Manifests Table */}
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Trunkline Manifests Registry</h3>
                        <table className="w-full text-left text-xs border">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3 border">Manifest Code</th>
                                    <th className="p-3 border">Route</th>
                                    <th className="p-3 border">Vehicle</th>
                                    <th className="p-3 border">Waybill Count</th>
                                    <th className="p-3 border">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-slate-800 dark:text-slate-200">
                                {manifests.map((m) => (
                                    <tr key={m.id}>
                                        <td className="p-3 border font-mono font-bold">{m.manifest_code}</td>
                                        <td className="p-3 border">
                                            {m.origin_hub?.name} → {m.destination_hub?.name}
                                        </td>
                                        <td className="p-3 border font-mono">{m.vehicle?.plate_number}</td>
                                        <td className="p-3 border">{m.waybills?.length || 0} waybills</td>
                                        <td className="p-3 border">
                                            <span className="rounded bg-sky-100 px-2 py-0.5 font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                {m.status}
                                            </span>
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
