import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, GeocodeHit, InputReservation, SharedData } from '@/types';

import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { useNewReservation } from '@/components/context/new-reservation-context';

import { MapContainer, TileLayer } from 'react-leaflet'
import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import AddressComboBox from '@/components/address-combo-box';
import LocationMarker from '@/components/location-marker';
import { Form, usePage } from '@inertiajs/react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import { latlngToString } from '@/lib/utils';
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

const DEFAULT_POSITION = new LatLng(14.5668952, 121.0679065);

const getInitialPosition = (locationType: string, pickup_latlng: string | null, dropoff_latlng: string | null): LatLng => {

    if (locationType === "pickup" && pickup_latlng) {
        const point = pickup_latlng.split(",");
        return new LatLng(parseFloat(point[0]), parseFloat(point[1]));
    }

    else if (locationType === "dropoff" && dropoff_latlng) {
        const point = dropoff_latlng.split(",");
        return new LatLng(parseFloat(point[0]), parseFloat(point[1]));
    }

    return DEFAULT_POSITION;
};


const getInitialAddress = (locationType: string, pickup_address: string | null, dropoff_address: string | null): string | null => {
    const address = locationType === "pickup" ? pickup_address : dropoff_address;
    if (address) {
        return address;
    }
    return null;
};

const PickUp = () => {

    const { props } = usePage<{
        location_type: string,
        pickup_address: string | null,
        pickup_latlng: string | null,
        dropoff_address: string | null,
        dropoff_latlng: string | null,
    }>();


    const initialPosition = getInitialPosition(props.location_type, props.pickup_latlng, props.dropoff_latlng);
    const initialAddress = getInitialAddress(props.location_type, props.pickup_address, props.dropoff_address);

    const [position, setPosition] = useState<LatLng>(initialPosition)
    const [selectedAddress, setSelectedAddress] = useState<string | null>(initialAddress);

    const controller = props.location_type == "pickup" ? ReservationController.processStep2 : ReservationController.processStep3;

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>

                    <Form
                        {...controller.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ submit, processing }) => (
                            <div>

                                <input type="hidden" name={props.location_type == 'pickup' ? 'pickup_address' : 'dropoff_address'} value={selectedAddress ?? ""} />
                                <input type="hidden" name={props.location_type == 'pickup' ? 'pickup_latlng' : 'dropoff_latlng'} value={latlngToString(position)} />

                                <AddressComboBox
                                    initialAddress={initialAddress}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    position={position}
                                    setPosition={setPosition}
                                    submit={submit}
                                />

                                <div className='rounded-md overflow-hidden absolute z-0 mt-4' style={{ height: "470px", width: "100%" }}>
                                    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className=''>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationMarker
                                            initialPosition={initialPosition}
                                            position={position}
                                            setPosition={setPosition}
                                            selectedAddress={selectedAddress}
                                            setSelectedAddress={setSelectedAddress}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </Form>

                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}

export default PickUp
