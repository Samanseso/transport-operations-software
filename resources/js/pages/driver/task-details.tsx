import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/task';
import { BreadcrumbItem, Reservation, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import L, { LatLng, LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { ChevronUp, Dot, Locate, LocateFixed, MapPin, Phone, Send } from 'lucide-react';
import '../../bootstrap';

import MapRoute from '@/components/map-route';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import AvatarImageSource from '../../../../public/assets/images/avatar.png';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task Details',
        href: index().url,
    },
];

const TaskDetails = () => {
    const { props } = usePage<{ reservation: Reservation; auth: { user: User } }>();

    console.log(props.reservation);

    const date = new Date(props.reservation.dispatch.schedule).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    const schedule = new Date(props.reservation.dispatch.schedule);
    const pickup = props.reservation.pickup_address.split(',').at(0) + ', ' + props.reservation.pickup_address.split(',').at(-4);
    const dropoff = props.reservation.dropoff_address.split(',')[0] + ', ' + props.reservation.dropoff_address.split(',').at(-4);

    const setBounds = (map: L.Map, bounds: LatLngBounds) => {
        map.fitBounds(bounds);
    };

    const [position, setPosition] = useState<LatLng | null>(null);
    const [routes, setRoute] = useState<LatLng[]>([]);
    const [vehicleLoc, setVehicleLoc] = useState();
    const [status, setStatus] = useState<string>(props.reservation.status || '');
    const [geoError, setGeoError] = useState<string | null>(null);

    const [driverFocus, setDriverFocus] = useState(false);

    const getNextAction = (current: string) => {
        if (!current || current === 'ASSIGNED' || current === 'PENDING') {
            return { label: 'Start', status: 'GOING TO PICKUP' };
        }
        if (current === 'GOING TO PICKUP') {
            return { label: 'Arrived at Pick Up', status: 'WAITING' };
        }
        if (current === 'WAITING') {
            return { label: 'Going to Dropoff', status: 'GOING TO DROPOFF' };
        }
        if (current === 'GOING TO DROPOFF') {
            return { label: 'Arrived at Dropoff', status: 'COMPLETE' };
        }
        return null;
    };

    const nextAction = getNextAction(status);

    const handleStatusUpdate = () => {
        if (!nextAction) return;

        router.post(
            `/tasks/${props.reservation.reservation_id}/status`,
            { status: nextAction.status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStatus(nextAction.status);
                },
            },
        );
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser.');
            return;
        }

        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = new LatLng(latitude, longitude);

                    setPosition(newPos);
                    setGeoError(null);

                    axios
                        .post(update().url, {
                            vehicle_id: props.reservation.dispatch.vehicle_id,
                            latitude,
                            longitude,
                        })
                        .catch(console.error);
                },
                (err) => {
                    if (err.code === 1) {
                        const isHttpIp =
                            window.location.protocol === 'http:' &&
                            window.location.hostname !== 'localhost' &&
                            window.location.hostname !== '127.0.0.1';
                        if (isHttpIp) {
                            setGeoError(
                                'Location is blocked by browser for HTTP IP addresses. Access via http://localhost:8000 or enable chrome://flags/#unsafely-treat-insecure-origin-as-secure.',
                            );
                        } else {
                            setGeoError('Location permission denied. Please allow location access in your browser settings.');
                        }
                    } else {
                        console.error('Geolocation error:', err);
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
            );
        };

        updateLocation();

        // Update location every 10 seconds
        const interval = setInterval(updateLocation, 10000);

        return () => clearInterval(interval);
    }, [props.reservation.dispatch.vehicle_id]);

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="">
                    {geoError && (
                        <div className="relative z-20 bg-amber-500 px-4 py-2 text-center text-xs font-medium text-white shadow">⚠️ {geoError}</div>
                    )}

                    <div className="relative bg-gray-200" style={{ width: '100vw', height: '70vh' }}>
                        <Button
                            className="absolute right-3 bottom-13 z-10"
                            size="icon"
                            variant="outline"
                            onClick={() => setDriverFocus(!driverFocus)}
                        >
                            {driverFocus ? <LocateFixed /> : <Locate />}
                        </Button>

                        <MapRoute reservation={props.reservation} initialDriverLoc={position} padding={0} driverFocus={driverFocus} />
                    </div>

                    <div className="-translate-y-10 rounded-xl bg-white">
                        <div className="flex items-center justify-between p-3">
                            <div className="">
                                <p className="text-sm">{date}</p>
                                <p className="text-xs text-gray-500">Appointment date</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {nextAction && (
                                    <Button className="bg-sky-400" onClick={handleStatusUpdate}>
                                        <Send />
                                        {nextAction.label}
                                    </Button>
                                )}
                                <ChevronUp size={15} className="mx-3" />
                            </div>
                        </div>
                        <Separator />

                        <div className="border-b-8 p-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-10">
                                        <AvatarImage src={AvatarImageSource} />
                                    </Avatar>

                                    <div>
                                        <p className="text-sm font-bold">{props.reservation.customer.name}</p>
                                        <p className="flex items-center text-xs text-gray-500">
                                            Pickup <Dot size={10} />
                                            <span className="w-50 truncate">{pickup}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mex-3 rounded-full border p-2">
                                    <Phone size={20} className="text-gray-500" />
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-gray-700">
                                <MapPin size={20} />
                                <p className="text-sm">{dropoff}</p>
                            </div>
                        </div>

                        <div>
                            <p>Appointment</p>
                            <div>
                                <p>Time Request</p>
                                <p>{schedule.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' })}</p>
                            </div>
                            <div>
                                <p>Date</p>
                                <p>{schedule.toLocaleDateString('default', { hour: 'numeric', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </SidebarProvider>
    );
};

export default TaskDetails;
