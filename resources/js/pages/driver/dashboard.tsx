import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CheckCircle2, ClipboardList, Truck, Navigation, ShieldCheck } from 'lucide-react';
import StatusTag from '@/components/status-tag';

interface DriverDashboardProps {
    metrics: {
        assigned_vehicle: {
            vehicle_id: string;
            plate_number: string;
            model: string;
            status: string;
        } | null;
        total_tasks: number;
        active_tasks: number;
        completed_tasks: number;
        today_tasks: number;
    };
    breakdowns: {
        task_statuses: Array<{
            label: string;
            count: number;
            percentage: number;
        }>;
    };
    upcomingTasks: Array<{
        reservation_id: string;
        customer_name: string | null;
        schedule: string | null;
        status: string;
        pickup_address: string;
        dropoff_address: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver Workspace',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { props } = usePage<SharedData & DriverDashboardProps>();
    const isOpen = props.sidebarOpen;

    const cards = [
        {
            title: 'Total Tasks',
            value: props.metrics.total_tasks,
            detail: 'All assigned reservations',
            icon: ClipboardList,
            color: 'text-sky-500',
        },
        {
            title: 'Active Tasks',
            value: props.metrics.active_tasks,
            detail: 'Currently on the road',
            icon: CalendarClock,
            color: 'text-indigo-500',
        },
        {
            title: 'Completed',
            value: props.metrics.completed_tasks,
            detail: 'Finished deliveries',
            icon: CheckCircle2,
            color: 'text-emerald-500',
        },
        {
            title: 'Today',
            value: props.metrics.today_tasks,
            detail: 'Scheduled for today',
            icon: Truck,
            color: 'text-amber-500',
        },
    ];

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Driver Portal & Workload Snapshot" />

                <div className="space-y-6 p-4 md:p-6">
                    {/* Hero Workload Banner */}
                    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-md">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Driver Operations Portal</p>
                        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Your Route & Workload Snapshot</h1>
                                <p className="mt-1 text-xs text-slate-400">
                                    Manage assigned vehicles, turn-by-turn tasks, and consignment deliveries.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 min-w-[200px]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Vehicle</p>
                                {props.metrics.assigned_vehicle ? (
                                    <div className="mt-1">
                                        <p className="font-semibold text-sm text-white">
                                            {props.metrics.assigned_vehicle.model}{' '}
                                            <span className="font-mono text-xs text-sky-400">
                                                {props.metrics.assigned_vehicle.plate_number}
                                            </span>
                                        </p>
                                        <StatusTag text={props.metrics.assigned_vehicle.status} className="mt-2" />
                                    </div>
                                ) : (
                                    <p className="mt-1 text-xs text-slate-400">No vehicle assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Metric Cards Grid - Fully Responsive */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.title}
                                    className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                                            {card.title}
                                        </p>
                                        <Icon className={`h-4 w-4 ${card.color}`} />
                                    </div>
                                    <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                                        {card.value}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.detail}</p>
                                </article>
                            );
                        })}
                    </section>

                    {/* Breakdown & Upcoming Tasks Section */}
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
                        <article className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Task Status Breakdown</h2>
                            <div className="mt-4 space-y-3.5">
                                {props.breakdowns.task_statuses.length > 0 ? (
                                    props.breakdowns.task_statuses.map((item) => (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {item.count} · {item.percentage}%
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-sky-500 transition-all duration-300"
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400">No task history recorded.</p>
                                )}
                            </div>
                        </article>

                        <article className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Upcoming Delivery Tasks</h2>
                            <div className="space-y-3">
                                {props.upcomingTasks.length > 0 ? (
                                    props.upcomingTasks.map((task) => (
                                        <div
                                            key={`${task.reservation_id}-${task.schedule}`}
                                            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                                                        {task.reservation_id}
                                                    </span>
                                                    <p className="font-semibold text-xs text-slate-900 dark:text-white">
                                                        {task.customer_name ?? 'Unknown customer'}
                                                    </p>
                                                    <p className="mt-1 text-[11px] text-slate-500 truncate max-w-sm">
                                                        {task.pickup_address.split(',')[0]} → {task.dropoff_address.split(',')[0]}
                                                    </p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <StatusTag text={task.status} />
                                                    <p className="mt-1.5 font-mono text-[11px] text-slate-400">
                                                        {task.schedule ?? 'No schedule'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
                                        No upcoming tasks in your queue.
                                    </div>
                                )}
                            </div>
                        </article>
                    </section>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
