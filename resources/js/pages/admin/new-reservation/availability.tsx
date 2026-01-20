import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, InputReservation, SharedData } from '@/types';


import { useEffect, useState } from 'react';
import CreateReservationLayout from '@/layouts/create-reservation/layout';


import { usePage } from '@inertiajs/react';
import { Vehicle } from '../../../types/index';

import Calendar from '@/components/calendar';
import VehicleCard from '@/components/vehicle-card';
import { useNewReservation } from '@/components/context/new-reservation-context';
import { SidebarProvider } from '@/components/ui/sidebar';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: '/reservations',
    },
    {
        title: 'Create',
        href: '/reservations/create/select',
    },
];

const SelectDateVehicle = () => {

    const { props } = usePage<{ date: string, availableVehicles: Vehicle[], unavailableVehicles: Vehicle[] }>();

    const dateToday = new Date();
    const queryDate = new Date(props.date == "today" ? dateToday : props.date)

    const { newReservation, setNewReservation } = useNewReservation();



    useEffect(() => {
        const url_year = queryDate.getFullYear();
        const url_month = String(queryDate.getMonth() + 1).padStart(2, '0');
        const ulr_day = String(queryDate.getDate()).padStart(2, '0');

        const formattedDate = `${url_year}-${url_month}-${ulr_day}`;

        setNewReservation({
            ...newReservation as InputReservation,
            date: formattedDate
        });

    }, []);



    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <Calendar />

                    <VehicleCard />

                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}

export default SelectDateVehicle