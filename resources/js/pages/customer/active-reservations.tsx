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
                <div className="flex flex-row">
                    <div className="flex-1 p-4 pt-4.5">
                        <p className="mb-4 text-sm font-bold">Active reservations ({props.reservations.length})</p>
                        <div className="mb-3">
                            <SearchBar
                                value={searchInput}
                                onChange={setSearchInput}
                                placeholder="Search reservation, driver, vehicle, location"
                            />
                        </div>

                        <div>
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
                                <div className="rounded-md border border-dashed px-4 py-6 text-sm text-gray-500">
                                    No active reservations match your search.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-3 relative overflow-hidden rounded-s-md" style={{ height: 'calc(100vh - 85px)', width: '100%' }}>
                        {selectedReservation && <FloatingReservationDetails reservation={selectedReservation} />}
                        {selectedReservation && <MapRoute reservation={selectedReservation} padding={50} />}
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
};

export default ActiveReservations;
