import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem } from '@/types';
import { FileSpreadsheet, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DestinationRow {
    [key: string]: any;
    address: string;
    consignee_name: string;
    cargo_type: string;
    cargo_weight_kg: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customer Portal', href: '/client/dashboard' },
    { title: 'Bulk Manifest Import', href: '/client/bulk-waybill' },
];

export default function BulkWaybill() {
    const [rows, setRows] = useState<DestinationRow[]>([
        { address: 'Ortigas Center, Pasig City', consignee_name: 'Juan Dela Cruz', cargo_type: 'General Freight', cargo_weight_kg: 250 },
        { address: 'BGC Taguig Logistics Center', consignee_name: 'Maria Clara', cargo_type: 'Cold Chain', cargo_weight_kg: 500 },
    ]);

    const handleAddRow = () => {
        setRows([...rows, { address: '', consignee_name: '', cargo_type: 'General Freight', cargo_weight_kg: 100 }]);
    };

    const handleRemoveRow = (idx: number) => {
        setRows(rows.filter((_, i) => i !== idx));
    };

    const handleRowChange = (idx: number, field: keyof DestinationRow, value: any) => {
        const updated = [...rows];
        updated[idx] = { ...updated[idx], [field]: value };
        setRows(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/client/bulk-waybill', { destinations: rows }, { preserveScroll: true });
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Bulk CSV / Batch Waybill Manifest Generator" />
                <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                            Bulk Manifest Batch Import & Waybill Generator
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Batch-create multiple delivery waybills automatically for corporate fulfillment.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Upload className="h-4 w-4 text-sky-500" />
                                Batch Waybill Table ({rows.length} Destined Orders)
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddRow}
                                className="text-xs font-semibold gap-1 active:scale-[0.98] transition-all"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Destination Row
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                                        <tr>
                                            <th className="px-3 py-3 font-mono">#</th>
                                            <th className="px-3 py-3">Delivery Address *</th>
                                            <th className="px-3 py-3">Receiver Name *</th>
                                            <th className="px-3 py-3">Cargo Type</th>
                                            <th className="px-3 py-3">Weight (kg)</th>
                                            <th className="px-3 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {rows.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <td className="px-3 py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={row.address}
                                                        onChange={(e) => handleRowChange(idx, 'address', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                                        placeholder="Delivery street address"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={row.consignee_name}
                                                        onChange={(e) => handleRowChange(idx, 'consignee_name', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                                        placeholder="Receiver name"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={row.cargo_type}
                                                        onChange={(e) => handleRowChange(idx, 'cargo_type', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        type="number"
                                                        value={row.cargo_weight_kg}
                                                        onChange={(e) => handleRowChange(idx, 'cargo_weight_kg', Number(e.target.value))}
                                                        className="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    {rows.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(idx)}
                                                            className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Button
                                type="submit"
                                className="bg-emerald-600 font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all px-6 py-2"
                            >
                                Batch-Generate Waybills & Queue Dispatch
                            </Button>
                        </form>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
