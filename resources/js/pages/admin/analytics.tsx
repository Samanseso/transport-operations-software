import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem } from '@/types';
import { BarChart3, TrendingUp, Truck, CheckCircle2, DollarSign, Activity, Award, ShieldAlert } from 'lucide-react';

interface Props {
    totalReservations: number;
    otdPercentage: number;
    utilizationPct: number;
    totalRevenueCents: number;
    totalCodCents: number;
    deliveryVolumeTrends: { day: string; volume: number }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Executive BI Analytics', href: '/admin/analytics' },
];

export default function AnalyticsDashboard({
    totalReservations,
    otdPercentage,
    utilizationPct,
    totalRevenueCents,
    totalCodCents,
    deliveryVolumeTrends,
}: Props) {
    const formatCurrency = (cents: number) => '₱' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

    const maxVolume = Math.max(1, ...deliveryVolumeTrends.map((t) => t.volume));

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Executive BI Analytics & Fleet KPIs" />
                <div className="space-y-6 p-4 md:p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-sky-500" />
                            Executive BI Analytics & Fleet KPIs
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Real-time On-Time Delivery (OTD) %, Fleet Capacity Utilization %, and P&L Revenue Insights.
                        </p>
                    </div>

                    {/* KPI Highlights Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* OTD KPI */}
                        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    On-Time Delivery (OTD) %
                                </span>
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="mt-2 font-mono text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {otdPercentage}%
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Award className="h-3.5 w-3.5 text-emerald-500" />
                                SLA Target: 98.0%
                            </p>
                        </div>

                        {/* Fleet Capacity Utilization */}
                        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Fleet Utilization %
                                </span>
                                <div className="rounded-xl bg-sky-50 p-2.5 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                                    <Truck className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="mt-2 font-mono text-3xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
                                {utilizationPct}%
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Active trucks in transit</p>
                        </div>

                        {/* Total Revenue */}
                        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Gross Billing Revenue
                                </span>
                                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="mt-2 font-mono text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                {formatCurrency(totalRevenueCents)}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Waybill gross bookings</p>
                        </div>

                        {/* Verified COD */}
                        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-800">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Verified COD Remittance
                                </span>
                                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {formatCurrency(totalCodCents)}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Reconciled COD cash flow</p>
                        </div>
                    </div>

                    {/* Delivery Volume Trends Chart Panel */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div>
                                <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-sky-500" />
                                    Weekly Delivery Volume Trend
                                </h3>
                                <p className="text-xs text-slate-500">Parcels & waybill dispatches per day</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-4 items-end h-52 border-b border-slate-100 pt-6 pb-4 dark:border-slate-800">
                            {deliveryVolumeTrends.map((t) => (
                                <div key={t.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{t.volume}</span>
                                    <div
                                        className="w-full rounded-t-xl bg-sky-500 transition-all duration-200 group-hover:bg-sky-600 shadow-xs"
                                        style={{ height: `${Math.max(12, (t.volume / maxVolume) * 100)}%` }}
                                    />
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
