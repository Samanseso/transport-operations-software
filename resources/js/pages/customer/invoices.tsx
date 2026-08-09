import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Payment, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Receipt, CheckCircle2, Download, CreditCard } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Portal',
        href: '/customer/dashboard',
    },
    {
        title: 'Invoices & Receipts',
        href: '/customer/invoices',
    },
];

interface Props {
    payments: Payment[];
    [key: string]: unknown;
}

export default function CustomerInvoices() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-emerald-500" />
                                My Transport Invoices & Payment Receipts
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                View billing history and download official receipts for completed delivery orders.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b p-4 border-slate-100 dark:border-slate-800">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Official Payment Receipts</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <tr>
                                        <th className="p-3">Reservation ID</th>
                                        <th className="p-3">Distance & Time</th>
                                        <th className="p-3">Total Fare</th>
                                        <th className="p-3">Payment Method</th>
                                        <th className="p-3">Reference No</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                    {props.payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-center text-slate-400">
                                                No payment receipts found for your account.
                                            </td>
                                        </tr>
                                    ) : (
                                        props.payments.map((p) => (
                                            <tr key={p.reservation_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                                                    {p.reservation_id}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {p.distance} ({p.travel_time})
                                                </td>
                                                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₱{Number(p.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 font-medium">{p.payment_method}</td>
                                                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{p.reference_number}</td>
                                                <td className="p-3">
                                                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                        PAID
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => alert(`Downloading Official Receipt for ${p.reservation_id}...`)}
                                                        className="h-7 gap-1 text-[11px] font-semibold"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                        PDF
                                                    </Button>
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
