import { Reservation } from '@/types'
import StatusTag from './status-tag'
import { Link } from '@inertiajs/react';

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { LatLng } from 'leaflet';
import { show } from '@/routes/task';


const Task = ({ reservation }: { reservation: Reservation }) => {

    const startDate = new Date(reservation.dispatch.schedule);
    const endDate = new Date(reservation.date);
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short' , 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit'
    };

    const startLoc = reservation.pickup_address.split(',')[0] + ", " + reservation.pickup_address.split(",").at(-4) + " ";
    const endLoc = reservation.dropoff_address.split(',')[0] + ", " + reservation.dropoff_address.split(",").at(-4);

    const [lat, lng] = reservation.dropoff_latlng.split(",").map(Number);
    const dropoffPosition = new LatLng(lat, lng);


    return (
        <Link as="div" className="bg-gray-100 rounded-sm mb-2 py-3 cursor-pointer" href={show(reservation.dispatch.vehicle_id)}>
            <div className="px-3">
                <div className='flex justify-between items-center mb-1'>
                    <p className='font-bold'>{reservation.customer_name}</p>
                    <StatusTag text={reservation.dispatch.status} />
                </div>

                <p className='text-xs text-gray-500 mb-2'>{reservation.service_type}</p>

                <div className='flex flex-row gap-2'>
                    <div className='w-20 flex flex-col gap-2'>
                        <p className='text-xs text-gray-500 text-nowrap'>
                            {startDate.toLocaleString('default', dateOptions)} 

                        </p>
                        <p className='text-xs text-gray-500 text-nowrap'>
                            {endDate.toLocaleString('default', dateOptions)} 

                        </p>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <div className="line"></div>
                        <div className="dot"></div>
                    </div>

                    <div className='flex-1 flex flex-col gap-2 w-45'>
                        <p className='text-xs truncate'>{startLoc}</p>
                        <p className='text-xs truncate'>{endLoc}</p>
                    </div>
                </div>
            </div>


            <div className='p-2 pb-0'>
                <div className='rounded-sm overflow-hidden ' style={{ width: '100%', height: '100px' }}>
                    <MapContainer center={dropoffPosition} zoom={15} scrollWheelZoom={false} dragging={false} className='z-0'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        />
                        <Marker position={dropoffPosition} />

                    </MapContainer>

                </div>
            </div>

        </Link>
    )
}

export default Task