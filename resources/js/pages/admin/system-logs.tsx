import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginationType, SharedData, SystemLogEntry } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Activity, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface LogsPageProps {
    logs: PaginationType<SystemLogEntry[]>;
    filters: {
        q?: string;
        action?: string;
        module?: string;
        date_from?: string;
        date_to?: string;
    };
    stats: {
        total: number;
        actions: Record<string, number>;
        modules: Record<string, number>;
    };
    modules: string[];
    actions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System Logs',
        href: '/logs',
    },
];

export default function SystemLogs() {
    const { props } = usePage<LogsPageProps & SharedData>();
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [query, setQuery] = useState(props.filters.q ?? '');
    const [action, setAction] = useState(props.filters.action ?? '');
    const [module, setModule] = useState(props.filters.module ?? '');
    const [dateFrom, setDateFrom] = useState(props.filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(props.filters.date_to ?? '');

    const summary = useMemo(() => {
        const adds = props.stats.actions.ADD ?? 0;
        const updates = props.stats.actions.UPDATE ?? 0;
        const deletes = props.stats.actions.DELETE ?? 0;
        return { adds, updates, deletes };
    }, [props.stats.actions]);

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
                                Audit Trail & System Security Logs
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Comprehensive audit log tracking database mutations, user actions, and administrative operations.
                            </p>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Total Audit Logs</p>
                                <Activity className="h-4 w-4 text-indigo-500" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">{props.stats.total.toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Add Events</p>
                                <PlusCircle className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {summary.adds.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Update Events</p>
                                <RefreshCw className="h-4 w-4 text-sky-500" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold text-sky-600 dark:text-sky-400">{summary.updates.toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">Delete Events</p>
                                <Trash2 className="h-4 w-4 text-rose-500" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">{summary.deletes.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">System Operations Audit Feed</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <tr>
                                        <th className="p-3">Timestamp</th>
                                        <th className="p-3">Action</th>
                                        <th className="p-3">Module</th>
                                        <th className="p-3">Target Entity</th>
                                        <th className="p-3">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                    {props.logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-6 text-center text-slate-400">
                                                No log entries found.
                                            </td>
                                        </tr>
                                    ) : (
                                        props.logs.data.map((log, index) => (
                                            <tr
                                                key={`${log.datelog}-${log.timelog}-${index}`}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="p-3 font-mono font-medium text-slate-900 dark:text-white">
                                                    {log.datelog} <span className="text-[11px] text-slate-400">{log.timelog}</span>
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                            log.action === 'DELETE'
                                                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                                                                : log.action === 'ADD'
                                                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                                  : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                                                        }`}
                                                    >
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-semibold text-slate-900 dark:text-white">{log.module}</td>
                                                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{log.performed_to}</td>
                                                <td className="p-3 text-slate-600 dark:text-slate-300">{log.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-start justify-between gap-3 text-xs text-slate-500 md:flex-row md:items-center dark:text-slate-400">
                        <span>
                            Showing {props.logs.from ?? 0}-{props.logs.to ?? 0} of {props.logs.total} entries
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={!props.logs.prev_page_url} asChild>
                                <Link href={props.logs.prev_page_url ?? ''}>Previous</Link>
                            </Button>
                            <Button variant="outline" size="sm" disabled={!props.logs.next_page_url} asChild>
                                <Link href={props.logs.next_page_url ?? ''}>Next</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
