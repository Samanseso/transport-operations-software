import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Payment, Reservation, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { DollarSign, CheckCircle2, Clock, CreditCard, Receipt } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Billing & Invoicing',
        href: '/finance/invoices',
    },
];

interface Props {
    payments: Payment[];
    reservations: Reservation[];
    stats: {
        total_revenue: number;
        paid_count: number;
        pending_count: number;
    };
    [key: string]: unknown;
}

export default function FinanceInvoices() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [isPayOpen, setIsPayOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [referenceNumber, setReferenceNumber] = useState('REF-' + Math.floor(100000 + Math.random() * 900000));
    const [totalAmount, setTotalAmount] = useState('4500');

    const handleMarkPaid = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            `/finance/invoices/${selectedReservationId}/pay`,
            {
                payment_method: paymentMethod,
                reference_number: referenceNumber,
                total_amount: parseFloat(totalAmount),
            },
            {
                onSuccess: () => {
                    setIsPayOpen(false);
                    setSelectedReservationId('');
                },
            }
        );
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Billing, Invoices & Payment Settlements
                            </h2>
                            <p className="text-xs text-slate-500">
                                Track customer transport payments, record settlements, and generate billing receipts.
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                if (props.reservations.length > 0) {
                                    setSelectedReservationId(props.reservations[0].reservation_id);
                                }
                                setIsPayOpen(true);
                            }}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        >
                            <CreditCard className="h-4 w-4" />
                            Record Payment
                        </Button>
                    </div>

                    {/* Financial KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase text-slate-500">Total Collected Revenue</p>
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">
                                ₱{Number(props.stats.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase text-slate-500">Paid Settlements</p>
                                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{props.stats.paid_count}</p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase text-slate-500">Pending Invoices</p>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-amber-600">{props.stats.pending_count}</p>
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b p-4 dark:border-slate-800">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Customer Payment Receipts</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <tr>
                                        <th className="p-3">Reservation ID</th>
                                        <th className="p-3">Customer</th>
                                        <th className="p-3">Total Amount</th>
                                        <th className="p-3">Payment Method</th>
                                        <th className="p-3">Reference No</th>
                                        <th className="p-3">Paid Date</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                    {props.payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-center text-slate-400">
                                                No payment records recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        props.payments.map((p) => (
                                            <tr key={p.reservation_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">
                                                    {p.reservation_id}
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {p.reservation?.customer_name || 'Walk-in Customer'}
                                                </td>
                                                <td className="p-3 font-bold text-emerald-600">
                                                    ₱{Number(p.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3">{p.payment_method}</td>
                                                <td className="p-3 font-mono">{p.reference_number}</td>
                                                <td className="p-3">{p.paid_at || '—'}</td>
                                                <td className="p-3">
                                                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        PAID
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Record Payment Dialog */}
                    {isPayOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record Customer Payment</h3>
                                <form onSubmit={handleMarkPaid} className="mt-4 space-y-4 text-xs">
                                    <div>
                                        <label className="block font-medium text-slate-700 dark:text-slate-300">Select Reservation</label>
                                        <select
                                            required
                                            value={selectedReservationId}
                                            onChange={(e) => setSelectedReservationId(e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            {props.reservations.map((r) => (
                                                <option key={r.reservation_id} value={r.reservation_id}>
                                                    {r.reservation_id} - {r.customer_name || 'Customer'} ({r.status})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-medium text-slate-700 dark:text-slate-300">Total Amount Paid (₱)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                        >
                                            <option value="Bank Transfer">Bank Transfer / Online Banking</option>
                                            <option value="GCash">GCash E-Wallet</option>
                                            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                                            <option value="Cheque">Corporate Cheque</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-medium text-slate-700 dark:text-slate-300">Transaction Reference No.</label>
                                        <Input
                                            required
                                            value={referenceNumber}
                                            onChange={(e) => setReferenceNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsPayOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                            Confirm & Save Receipt
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
