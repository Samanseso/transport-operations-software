import ActiveDisptach from '@/components/active-dispatch';
import FloatingReservationDetails from '@/components/floating-reservation-details';
import MapRoute from '@/components/map-route';
import SearchBar from '@/components/search-bar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/my-active-reservations';
import { BreadcrumbItem, Reservation, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Navigation, Compass } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Active Reservations',
        href: index().url,
    },
];

const ActiveReservations = () => {
    const props = usePage<{ reservations: Reservation[]; selectedReservation?: Reservation; filters?: { q?: string } }>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const [searchInput, setSearchInput] = useState(props.filters?.q ?? '');
    const query = props.filters?.q ?? '';

    useEffect(() => {
        const nextQuery = searchInput.trim();

        if (nextQuery === query) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                '/my-active-reservations',
                { q: nextQuery || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [query, searchInput]);

    const selectedReservation =
        props.reservations.find((reservation) => reservation.reservation_id === props.selectedReservation?.reservation_id) ??
        props.reservations[0] ??
        null;

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-row h-[calc(100vh-65px)] overflow-hidden">
                    <div className="w-[340px] flex-col p-4 border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-y-auto space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Compass className="h-4 w-4 text-sky-500" />
                                Active Reservations ({props.reservations.length})
                            </h2>
                        </div>
                        <div>
                            <SearchBar
                                value={searchInput}
                                onChange={setSearchInput}
                                placeholder="Search waybill, driver, location..."
                            />
                        </div>

                        <div className="space-y-2">
                            {props.reservations.length > 0 ? (
                                props.reservations.map((reservation) => (
                                    <ActiveDisptach
                                        key={reservation.reservation_id}
                                        reservation={reservation}
                                        selectedReservation={selectedReservation?.reservation_id ?? ''}
                                        href={`/my-active-reservations/${reservation.reservation_id}${query ? `?q=${encodeURIComponent(query)}` : ''}`}
                                    />
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                                    No active reservations match your search.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden bg-slate-950">
                        {selectedReservation && <FloatingReservationDetails reservation={selectedReservation} />}
                        {selectedReservation && <MapRoute reservation={selectedReservation} padding={50} />}
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
};

export default ActiveReservations;
