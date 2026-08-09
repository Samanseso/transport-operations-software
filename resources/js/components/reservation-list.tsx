import { show, step } from '@/routes/reservations';
import { PaginationType, type Reservation } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Eye, LayoutGrid, MapPin, PackageSearch, PenBox, Plus, Printer, SlidersHorizontal, Table as TableIcon, Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import '../bootstrap';
import { DeleteReservation } from './delete-reservation';
import { Pagination } from './pagination';
import ReservationCard from './reservation-card';
import StatusTag from './status-tag';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function ReseravtionList({ reservations }: { reservations: PaginationType<Reservation[]> }) {
    const [reservationList, setReservationList] = useState<Reservation[]>(reservations.data);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [selectedReservationId, setSelectedReservationId] = useState<string>('');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const { filters, statuses, serviceTypes } = usePage<{
        filters?: { q?: string; status?: string; service_type?: string; date_from?: string; date_to?: string };
        statuses?: string[];
        serviceTypes?: string[];
    }>().props;

    const [searchInput, setSearchInput] = useState(filters?.q ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [serviceTypeFilter, setServiceTypeFilter] = useState(filters?.service_type ?? '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters?.date_to ?? '');

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const updateTable = (newReservation: PaginationType<Reservation[]>) => {
        setReservationList(newReservation.data);
    };

    useEffect(() => {
        setReservationList(reservations.data);
    }, [reservations.data]);

    useEffect(() => {
        const channel = window.Echo.channel('reservations');

        channel.listen('.ReservationCreated', (e: { reservation: Reservation }) => {
            setReservationList((prev) => {
                if (prev.some((r) => r.reservation_id === e.reservation.reservation_id)) {
                    return prev;
                }
                return [e.reservation, ...prev];
            });
        });

        channel.listen('.ReservationDeleted', (e: { reservation_id: string }) => {
            setReservationList((prev) => prev.filter((item) => item.reservation_id !== e.reservation_id));
        });

        return () => {
            window.Echo.leave('reservations');
        };
    }, []);

    const submitWithFilters = (overrides?: {
        q?: string;
        status?: string;
        service_type?: string;
    }) => {
        const q = overrides?.q !== undefined ? overrides.q : searchInput;
        const status = overrides?.status !== undefined ? overrides.status : statusFilter;
        const service_type = overrides?.service_type !== undefined ? overrides.service_type : serviceTypeFilter;

        router.get(
            '/reservations',
            {
                q: q || undefined,
                status: status === 'none' ? '' : status || undefined,
                service_type: service_type === 'none' ? '' : service_type || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const applyFilters = (event: React.FormEvent) => {
        event.preventDefault();
        submitWithFilters();
    };

    const clearFilters = () => {
        setSearchInput('');
        setStatusFilter('');
        setServiceTypeFilter('');
        setDateFrom('');
        setDateTo('');
        router.get('/reservations', {}, { replace: true });
    };

    const handleDeleteClick = (id: string) => {
        setSelectedReservationId(id);
        setIsOpenDeleteModal(true);
    };

    const formatCurrency = (amountCents?: number) => {
        const cents = amountCents || 150000;
        return `₱${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="space-y-4">
            {/* Header & Filter Controls Bar */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Reservations</h2>
                    <p className="text-xs text-slate-500">Manage active line-haul shipments, waybill dispatches, and consignment tracking.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View Switcher Toggle */}
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewMode === 'table'
                                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <TableIcon className="h-3.5 w-3.5" />
                            Table
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('cards')}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                                viewMode === 'cards'
                                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Cards
                        </button>
                    </div>

                    <Link href={step('1', { query: { date: tomorrowDate } })}>
                        <Button className="bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]">
                            <Plus className="h-4 w-4" />
                            New Reservation
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters Section */}
            <form onSubmit={applyFilters} className="flex flex-wrap items-center gap-2.5">
                <div className="max-w-[300px] min-w-[220px] flex-1">
                    <Input
                        type="text"
                        placeholder="Search waybill #, customer, address..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="bg-white dark:bg-slate-900"
                    />
                </div>
                <div className="w-40">
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            submitWithFilters({ status: val });
                        }}
                    >
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">All Statuses</SelectItem>
                            {(statuses ?? []).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.replace(/_/g, ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-44">
                    <Select
                        value={serviceTypeFilter}
                        onValueChange={(val) => {
                            setServiceTypeFilter(val);
                            submitWithFilters({ service_type: val });
                        }}
                    >
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                            <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">All Services</SelectItem>
                            {(serviceTypes ?? []).map((service) => (
                                <SelectItem key={service} value={service}>
                                    {service}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </form>

            {/* Table / Card Views */}
            {reservationList.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                        <PackageSearch className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Reservations Found</h3>
                    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                        No shipment reservations matched your active filter query. Try clearing filters or create a new reservation.
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                        <Link href={step('1', { query: { date: tomorrowDate } })}>
                            <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
                                <Plus className="h-4 w-4" /> Create Reservation
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : viewMode === 'table' ? (
                /* Enterprise Data Table */
                <div className="rounded-lg border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                <tr>
                                    <th className="p-3">Waybill No</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Route Origin / Destination</th>
                                    <th className="p-3">Service Type</th>
                                    <th className="p-3">Schedule</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Total Fare</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                                {reservationList.map((r) => {
                                    const waybillNo = r.waybill_number || `WB-${r.reservation_id.slice(0, 8).toUpperCase()}`;
                                    const stopsCount = r.waypoints ? r.waypoints.length : 1;
                                    const scheduleDate = r.dispatch?.schedule ? new Date(r.dispatch.schedule) : new Date(r.date);

                                    return (
                                        <tr key={r.reservation_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            {/* Waybill */}
                                            <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">{waybillNo}</td>

                                            {/* Customer */}
                                            <td className="p-3">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {r.customer?.name || r.customer_name || 'Valued Client'}
                                                </div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{r.customer?.email || 'N/A'}</div>
                                            </td>

                                            {/* Route */}
                                            <td className="max-w-[260px] p-3">
                                                <div className="flex items-center gap-1 truncate font-medium text-slate-900 dark:text-white">
                                                    <MapPin className="h-3 w-3 shrink-0 text-emerald-500" />
                                                    <span className="truncate">{r.pickup_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1 truncate text-[11px] text-slate-500">
                                                    <MapPin className="h-3 w-3 shrink-0 text-rose-500" />
                                                    <span className="truncate">{r.dropoff_address}</span>
                                                    {stopsCount > 1 && (
                                                        <span className="py-0.2 ml-1 rounded-full bg-slate-100 px-1.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            +{stopsCount - 1} stop
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Service Type */}
                                            <td className="p-3">
                                                <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {r.service_type || 'General Freight'}
                                                </span>
                                            </td>

                                            {/* Schedule */}
                                            <td className="p-3">
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="font-mono text-[11px] text-slate-500">{r.time || '09:00 AM'}</div>
                                            </td>

                                            {/* Status */}
                                            <td className="p-3">
                                                <StatusTag text={r.status} />
                                            </td>

                                            {/* Total Fare */}
                                            <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(r.total_fare_cents)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            •••
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={show(r.reservation_id)} className="flex cursor-pointer items-center gap-2">
                                                                <Eye className="h-3.5 w-3.5 text-slate-500" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/reservations/${r.reservation_id}/waybill`}
                                                                className="flex cursor-pointer items-center gap-2"
                                                            >
                                                                <Printer className="h-3.5 w-3.5 text-slate-500" />
                                                                Print Waybill
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/reservations/${r.reservation_id}/edit`}
                                                                className="flex cursor-pointer items-center gap-2"
                                                            >
                                                                <PenBox className="h-3.5 w-3.5 text-sky-500" />
                                                                Edit Reservation
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(r.reservation_id)}
                                                            className="flex cursor-pointer items-center gap-2 text-rose-600 dark:text-rose-400"
                                                        >
                                                            <Trash className="h-3.5 w-3.5" />
                                                            Delete Reservation
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Card View Mode */
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reservationList.map((r) => (
                        <ReservationCard key={r.reservation_id} reservation={r} updateTable={updateTable} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {reservations.links && reservations.links.length > 0 && (
                <div className="pt-2">
                    <Pagination data={reservations} />
                </div>
            )}

            {/* Delete Modal */}
            <DeleteReservation
                reservation_id={selectedReservationId}
                isOpen={isOpenDeleteModal}
                setIsOpen={setIsOpenDeleteModal}
                updateTable={updateTable}
            />
        </div>
    );
}
