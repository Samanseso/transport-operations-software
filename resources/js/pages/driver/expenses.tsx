import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Driver, DriverExpense, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { DollarSign, Plus, Receipt, Clock, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver Tasks',
        href: '/tasks',
    },
    {
        title: 'Expense Logging',
        href: '/driver/expenses',
    },
];

interface Props {
    driver: Driver | null;
    expenses: DriverExpense[];
    [key: string]: unknown;
}

export default function DriverExpenses() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [category, setCategory] = useState('Toll Fee');
    const [amount, setAmount] = useState('250');
    const [description, setDescription] = useState('');

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            '/driver/expenses',
            {
                category,
                amount: parseFloat(amount),
                description,
            },
            {
                onSuccess: () => {
                    setDescription('');
                    setAmount('');
                },
            }
        );
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-md space-y-6 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Out-of-Pocket Expense Logger
                            </h2>
                            <p className="text-xs text-slate-500">Log toll fees, parking, or emergency fuel expenses.</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs">
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Expense Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 w-full rounded-md border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                            >
                                <option value="Toll Fee">Expressway Toll Fee</option>
                                <option value="Fuel">Gasoline / Diesel Fill</option>
                                <option value="Parking">Parking Fee</option>
                                <option value="Emergency Repair">Minor Tire / Mechanical Repair</option>
                                <option value="Other">Other Operational Cost</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Amount (₱)</label>
                            <Input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300">Description / Receipt Note</label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. SLEX Toll Gate Receipt #4412"
                            />
                        </div>

                        <Button type="submit" className="h-11 w-full bg-emerald-600 font-bold hover:bg-emerald-700">
                            Submit Expense Request
                        </Button>
                    </form>

                    {/* Past Expenses List */}
                    <div className="rounded-xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-3">Logged Reimbursement Requests</h3>
                        <div className="space-y-3">
                            {props.expenses.length === 0 ? (
                                <p className="text-center text-xs text-slate-400 py-4">No logged expenses.</p>
                            ) : (
                                props.expenses.map((exp) => (
                                    <div
                                        key={exp.expense_id}
                                        className="flex items-center justify-between rounded-lg border p-3 text-xs dark:border-slate-800"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{exp.category}</p>
                                            <p className="text-[11px] text-slate-500">{exp.description || 'No description'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-emerald-600">
                                                ₱{Number(exp.amount).toFixed(2)}
                                            </p>
                                            <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                                                {exp.status}
                                            </span>
                                        </div>
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
