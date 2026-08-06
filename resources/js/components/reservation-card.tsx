import { show } from '@/routes/reservations';
import { PaginationType, Reservation } from '@/types';
import { Link } from '@inertiajs/react';
import { LatLng } from 'leaflet';
import { EllipsisVertical, Eye, PenBox, Trash } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { DeleteReservation } from './delete-reservation';
import StatusTag from './status-tag';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface ReservationCardProps {
    reservation: Reservation;
    updateTable: (newReservation: PaginationType<Reservation[]>) => void;
}

const ReservationCard = ({ reservation, updateTable }: ReservationCardProps) => {
    const startDate = new Date(reservation.dispatch.schedule);
    const endDate = new Date(reservation.date);
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };

    const startLoc = reservation.pickup_address.split(',')[0] + ', ' + reservation.pickup_address.split(',').at(-4) + ' ';
    const endLoc = reservation.dropoff_address.split(',')[0] + ', ' + reservation.dropoff_address.split(',').at(-4);

    const [lat, lng] = reservation.dropoff_latlng.split(',').map(Number);
    const dropoffPosition = new LatLng(lat, lng);

    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const doDelete = (id: string) => {
        setIsOpenDeleteModal(true);
        setSelectedStudent(id);
    };

    console.log(reservation);

    return (
        <div className="mb-2 cursor-pointer rounded-sm bg-gray-100 py-3">
            <div className="px-3">
                <div className="mb-1 flex items-center justify-between">
                    <div className="flex gap-2">
                        <p className="font-bold">{reservation.customer.name}</p>
                        <StatusTag text={reservation.status} />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem asChild>
                                <Link href={show(reservation.reservation_id)}>
                                    <Eye className="size-4 text-black" /> View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/reservations/${reservation.reservation_id}/edit`}>
                                    <PenBox className="text-blue size-4" />
                                    Update
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => doDelete(reservation.reservation_id)}>
                                <Trash className="size-4 text-rose-500" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="mb-2 text-xs text-gray-500">{reservation.service_type}</p>

                <div className="flex flex-row gap-2">
                    <div className="flex w-20 flex-col gap-2">
                        <p className="text-xs text-nowrap text-gray-500">{startDate.toLocaleString('default', dateOptions)}</p>
                        <p className="text-xs text-nowrap text-gray-500">{endDate.toLocaleString('default', dateOptions)}</p>
                    </div>
                    <div className="timeline">
                        <div className="dot"></div>
                        <div className="line"></div>
                        <div className="dot"></div>
                    </div>

                    <div className="flex w-45 flex-1 flex-col gap-2">
                        <p className="truncate text-xs">{startLoc}</p>
                        <p className="truncate text-xs">{endLoc}</p>
                    </div>
                </div>
            </div>

            <div className="p-2 pb-0">
                <div className="overflow-hidden rounded-sm" style={{ width: '100%', height: '100px' }}>
                    <MapContainer center={dropoffPosition} zoom={15} scrollWheelZoom={false} dragging={false} className="z-0">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        />
                        <Marker position={dropoffPosition} />
                    </MapContainer>
                </div>
            </div>

            <DeleteReservation
                reservation_id={selectedStudent}
                isOpen={isOpenDeleteModal}
                setIsOpen={setIsOpenDeleteModal}
                updateTable={updateTable}
            />
        </div>
    );
};

export default ReservationCard;
