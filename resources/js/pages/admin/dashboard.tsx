import DashboardMapSection from '@/components/dashboard-map-section';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, Reservation, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CalendarClock, ClipboardList, ShieldCheck, TrendingUp, Truck, Users } from 'lucide-react';

interface DashboardMetricGroup {
    reservations: {
        total: number;
        today: number;
        active: number;
        completed: number;
    };
    fleet: {
        total: number;
        available: number;
        maintenance: number;
        assigned: number;
    };
    users: {
        customers: number;
        drivers: number;
        admins: number;
        drivers_without_vehicle: number;
    };
    dispatches_today: number;
    logs_today: number;
}

interface DashboardBreakdownItem {
    label: string;
    count: number;
    percentage: number;
}

interface DashboardTrendPoint {
    label: string;
    reservations: number;
    activity: number;
}

interface UpcomingDispatch {
    reservation_id: string;
    schedule: string;
    customer_name: string | null;
    vehicle_model: string | null;
    driver_name: string | null;
    status: string | null;
}

interface RecentLog {
    datelog: string;
    timelog: string;
    action: string;
    module: string;
    performed_to: string;
    description: string;
}

interface AdminDashboardProps {
    metrics: DashboardMetricGroup;
    trends: {
        activity: DashboardTrendPoint[];
    };
    breakdowns: {
        reservation_statuses: DashboardBreakdownItem[];
        fleet_statuses: DashboardBreakdownItem[];
        user_roles: DashboardBreakdownItem[];
    };
    upcomingDispatches: UpcomingDispatch[];
    recentLogs: RecentLog[];
    activeDispatches?: Reservation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { props } = usePage<SharedData & AdminDashboardProps>();
    const isOpen = props.sidebarOpen;
    const trendMax = Math.max(1, ...props.trends.activity.flatMap((point) => [point.reservations, point.activity]));

    const metricCards = [
        {
            title: 'Reservations',
            value: props.metrics.reservations.total,
            detail: `${props.metrics.reservations.today} created today`,
            icon: ClipboardList,
            color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400',
        },
        {
            title: 'Active Dispatches',
            value: props.metrics.reservations.active,
            detail: `${props.metrics.dispatches_today} scheduled today`,
            icon: CalendarClock,
            color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
        },
        {
            title: 'Fleet Ready',
            value: props.metrics.fleet.available,
            detail: `${props.metrics.fleet.total} total vehicles`,
            icon: Truck,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
        },
        {
            title: 'Customers',
            value: props.metrics.users.customers,
            detail: `${props.metrics.users.drivers} drivers in system`,
            icon: Users,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
        },
        {
            title: 'System Activity',
            value: props.metrics.logs_today,
            detail: `${props.metrics.reservations.completed} completed jobs`,
            icon: ShieldCheck,
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400',
        },
    ];

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />

                <div className="space-y-6 p-4 md:p-6">
                    {/* Top Stats Section */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {metricCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.title}
                                    className="group rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">{card.title}</p>
                                        <div className={`rounded-lg p-2.5 transition-transform group-hover:scale-105 ${card.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                                    <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                                        {card.detail}
                                    </p>
                                </article>
                            );
                        })}
                    </section>

                    {/* Live Fleet Active Dispatches Map Section */}
                    {/* <section>
                        <DashboardMapSection dispatches={props.activeDispatches || []} />
                    </section> */}

                    {/* Chart & Status Breakdowns */}
                    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
                        {/* <article className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                                <div>
                                    <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                                        <Activity className="h-4 w-4 text-sky-500" />
                                        7-Day Operations & Log Activity
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Daily waybill reservations created versus system events logged.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-xs" />
                                        Reservations
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        Logs
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-7 gap-3 pt-2">
                                {props.trends.activity.map((point) => (
                                    <div key={point.label} className="flex flex-col items-center gap-3">
                                        <div className="flex h-52 items-end gap-1.5">
                                            <div
                                                className="w-4 rounded-t-lg bg-sky-500 transition-all hover:bg-sky-600"
                                                style={{ height: `${Math.max(8, (point.reservations / trendMax) * 100)}%` }}
                                                title={`${point.reservations} reservations`}
                                            />
                                            <div
                                                className="w-4 rounded-t-lg bg-slate-200 transition-all hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                                                style={{ height: `${Math.max(8, (point.activity / trendMax) * 100)}%` }}
                                                title={`${point.activity} logs`}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{point.label}</p>
                                            <p className="font-mono text-[10px] text-slate-400">
                                                {point.reservations}/{point.activity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article> */}

                        {/* Live Fleet Active Dispatches Map Section */}
                        <section>
                            <DashboardMapSection dispatches={props.activeDispatches || []} />
                        </section>

                        <div className="grid gap-6">
                            {/* Reservation Statuses */}
                            <article className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Reservation Status Breakdown</h2>
                                <div className="mt-4 space-y-3.5">
                                    {props.breakdowns.reservation_statuses.map((item) => (
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
                                    ))}
                                </div>
                            </article>

                            {/* Fleet Statuses */}
                            <article className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Fleet Availability & Maintenance</h2>
                                <div className="mt-4 space-y-3.5">
                                    {props.breakdowns.fleet_statuses.map((item) => (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {item.count} · {item.percentage}%
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </section>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
