import { BreadcrumbItem, SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import ReservationsLayout from '@/layouts/reservations/layout';
import { usePage } from '@inertiajs/react';
import { index } from '@/routes/reservations';
import { Reservation } from '../../types/index';
import MapRoute from '@/components/map-route';
import ReservationDetailsLayout from '@/layouts/reservation-details/layout';
import { SidebarProvider } from '@/components/ui/sidebar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: index().url,
    },
];

export default function ReservationDetails() {
    const { props } = usePage<{ data: Reservation }>();
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider >
            <AppLayout breadcrumbs={breadcrumbs}>
                <ReservationDetailsLayout>



                    {/* <MapRoute reservation={props.data} /> */}

                </ReservationDetailsLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
