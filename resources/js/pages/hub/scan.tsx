import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, ScanLine, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface Hub {
    id: number;
    hub_code: string;
    name: string;
}

interface Props {
    hubs: Hub[];
    activeHubId: number;
    recentScans: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Logistics Hubs', href: '/hub' },
    { title: 'Laser Scanner', href: '/hub/scan' },
];

export default function HubScan({ hubs, activeHubId, recentScans }: Props) {
    const [selectedHub, setSelectedHub] = useState<number>(activeHubId || hubs[0]?.id || 1);
    const [waybillInput, setWaybillInput] = useState('');
    const [scanType, setScanType] = useState('INBOUND_SORT');
    const [sortingBin, setSortingBin] = useState('BIN-101');
    const [lastScanMessage, setLastScanMessage] = useState<string | null>(null);

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!waybillInput.trim()) return;

        router.post(
            '/hub/scan',
            {
                waybill_number: waybillInput.trim(),
                hub_id: selectedHub,
                scan_type: scanType,
                sorting_bin: sortingBin,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLastScanMessage(`Waybill ${waybillInput.toUpperCase()} scanned into ${sortingBin}`);
                    setWaybillInput('');
                },
            },
        );
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="High-Speed Laser Parcel Scanner" />
                <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                <ScanLine className="h-5 w-5 text-emerald-500" />
                                High-Speed Waybill Laser Scanner
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Barcode/QR laser scanner interface for hub sorting, bagging, and driver handovers.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                            <Zap className="h-3.5 w-3.5" /> High-Speed Mode
                        </span>
                    </div>

                    {/* Scanner Control Panel */}
                    <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Active Station Hub</label>
                                <select
                                    value={selectedHub}
                                    onChange={(e) => setSelectedHub(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                >
                                    {hubs.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.hub_code} - {h.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Scan Workflow Type</label>
                                <select
                                    value={scanType}
                                    onChange={(e) => setScanType(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                >
                                    <option value="INBOUND_SORT">📥 Inbound Sorting</option>
                                    <option value="OUTBOUND_LINEHAUL">📦 Outbound Line-haul Bagging</option>
                                    <option value="DISPATCH_HANDOVER">🚚 Last-Mile Driver Handover</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Assigned Sorting Bin</label>
                                <input
                                    type="text"
                                    value={sortingBin}
                                    onChange={(e) => setSortingBin(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-bold text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                    placeholder="BIN-101"
                                />
                            </div>
                        </div>

                        {/* Barcode Laser Input */}
                        <form onSubmit={handleScanSubmit} className="space-y-3 pt-2">
                            <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                Barcode / QR Laser Input (Auto-submits on enter/scan)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    autoFocus
                                    value={waybillInput}
                                    onChange={(e) => setWaybillInput(e.target.value)}
                                    placeholder="Scan barcode e.g. WB-2026-9A82F..."
                                    className="flex-1 rounded-xl border-2 border-emerald-500/80 bg-white p-3.5 font-mono text-base font-bold text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-hidden dark:bg-slate-950 dark:text-slate-100"
                                />
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 px-6 font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
                                >
                                    Scan Waybill
                                </Button>
                            </div>
                        </form>

                        {lastScanMessage && (
                            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                {lastScanMessage}
                            </div>
                        )}
                    </div>

                    {/* Scan Batch Feed */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">Scanned Parcels Batch Log</h3>
                        <div className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                            {recentScans.length === 0 ? (
                                <p className="py-4 text-center text-xs text-slate-500">No waybills scanned in this session yet.</p>
                            ) : (
                                recentScans.map((s) => (
                                    <div key={s.id} className="flex items-center justify-between py-3 font-mono">
                                        <span className="font-bold text-sky-600 dark:text-sky-400">{s.waybill_number}</span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            Bin: {s.sorting_bin}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
