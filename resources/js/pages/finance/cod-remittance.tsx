import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem } from '@/types';
import { Wallet, CheckCircle2, Clock, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusTag from '@/components/status-tag';

interface RemittanceItem {
    id: number;
    remittance_code: string;
    driver_id?: string;
    waybill_number: string;
    amount_cents: number;
    status: string;
    remitted_at?: string;
    reservation?: any;
}

interface Props {
    remittances: RemittanceItem[];
    totalCollectedCents: number;
    totalPendingCents: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Finance', href: '/finance/invoices' },
    { title: 'Driver COD Remittance', href: '/finance/cod-remittance' },
];

export default function CodRemittance({ remittances, totalCollectedCents, totalPendingCents }: Props) {
    const handleVerify = (id: number) => {
        router.post(`/finance/cod-remittance/${id}/verify`, {}, { preserveScroll: true });
    };

    const formatCurrency = (cents: number) => '₱' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Driver Cash-on-Delivery (COD) Remittance Board" />
                <div className="space-y-6 p-4 md:p-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-emerald-500" />
                            Driver COD Remittance & Financial Reconciliation
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Verify driver cash collections upon parcel delivery and reconcile financial ledgers.
                        </p>
                    </div>

                    {/* Summary KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase">
                                    Verified Finance Revenue (COD)
                                </span>
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="mt-2 font-mono text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                                {formatCurrency(totalCollectedCents)}
                            </h3>
                            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">Reconciled in bank account</p>
                        </div>

                        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 shadow-xs dark:border-amber-900/60 dark:bg-amber-950/20">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-amber-800 dark:text-amber-300 uppercase">
                                    Pending Driver Handover (COD)
                                </span>
                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="mt-2 font-mono text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
                                {formatCurrency(totalPendingCents)}
                            </h3>
                            <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">Awaiting hub cash dropoff</p>
                        </div>
                    </div>

                    {/* Remittances Registry Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Cash Collection Ledgers
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3.5">Voucher Code</th>
                                        <th className="px-4 py-3.5">Waybill #</th>
                                        <th className="px-4 py-3.5">Driver ID</th>
                                        <th className="px-4 py-3.5">COD Amount</th>
                                        <th className="px-4 py-3.5">Status</th>
                                        <th className="px-4 py-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {remittances.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                                                No COD remittances recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        remittances.map((r) => (
                                            <tr key={r.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                                                <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                                                    {r.remittance_code}
                                                </td>
                                                <td className="px-4 py-3.5 font-mono text-sky-600 dark:text-sky-400 font-semibold">
                                                    {r.waybill_number}
                                                </td>
                                                <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                                                    {r.driver_id || 'Assigned Driver'}
                                                </td>
                                                <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    {formatCurrency(r.amount_cents)}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <StatusTag text={r.status} />
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    {r.status !== 'VERIFIED_BY_FINANCE' && (
                                                        <Button
                                                            onClick={() => handleVerify(r.id)}
                                                            size="sm"
                                                            className="bg-emerald-600 font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all text-xs"
                                                        >
                                                            Verify Handover
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
