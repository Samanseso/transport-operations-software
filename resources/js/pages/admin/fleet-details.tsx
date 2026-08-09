import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, Reservation, SharedData, Vehicle } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, EllipsisVertical, ExternalLink, FileSearch, MessageCircle, Phone, Wrench } from 'lucide-react';
import AvatarImageSource from '../../../../public/assets/images/avatar.png';
import VehicleImage from '../../../../public/assets/images/mitsubishi-l300.png';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import FleetmanagementLayout from '@/layouts/fleet-management/layout';
import { Separator } from '@/components/ui/separator';
import MapRoutePreview from '@/components/map-route-preview';
import { SidebarProvider } from '@/components/ui/sidebar';
import MapRoute from '@/components/map-route';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: ""
    },
];


const FleetDetails = () => {
    const props = usePage<{ vehicles: Vehicle[], selectedVehicle: Vehicle, reservations: Reservation[]; }>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs} >
                <FleetmanagementLayout vehicles={props.vehicles} selectedVehicle={props.selectedVehicle} >
                    <div className='flex flex-col ps-3' style={{ height: "calc(100vh - 73px)", width: "100%" }}>
                        <div className='flex justify-between items-center mb-3'>
                            <div className='flex items-center gap-2'>
                                <Avatar className='size-10'>
                                    <AvatarImage src={AvatarImageSource} />
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between'>
                                        <p className="text-sm">{props.selectedVehicle.driver?.name ?? "Unassigned"}</p>
                                    </div>
                                    <p className='text-xs text-gray-500'>ID {props.selectedVehicle.driver_id ?? "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-center">
                                <Button variant="ghost"><MessageCircle /></Button>
                                <Button variant="ghost"><Phone /></Button>
                                <div className='line'></div>
                                <Button variant="ghost"><EllipsisVertical /></Button>
                            </div>
                        </div>
                        <div className='flex justify-between bg-muted full p-6 rounded relative overflow-hidden'>
                            <div className='flex flex-col gap-4'>
                                <div className="flex items-center gap-3">
                                    <p className='text-lg font-bold'>{props.selectedVehicle.model}</p>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                        props.selectedVehicle.status === "UNSAFE_FOR_DRIVE"
                                            ? "bg-red-600 text-white"
                                            : props.selectedVehicle.status === "IN_MAINTENANCE"
                                            ? "bg-rose-500 text-white"
                                            : "bg-emerald-600 text-white"
                                    }`}>
                                        {props.selectedVehicle.status}
                                    </span>
                                </div>
                                <div className='flex flex-wrap gap-8'>
                                    <div>
                                        <p className='text-xs text-gray-500'>VIN Chassis Number</p>
                                        <p className='font-mono font-bold text-sm'>{props.selectedVehicle.vin_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Capacity / Load</p>
                                        <p className='font-bold text-sm'>{props.selectedVehicle.capacity || "Default Specs"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Registration Expiry</p>
                                        <p className='font-mono font-bold text-sm'>{props.selectedVehicle.registration_expires_at || "Not Set"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-500'>Insurance Expiry</p>
                                        <p className='font-mono font-bold text-sm'>{props.selectedVehicle.insurance_expires_at || "Not Set"}</p>
                                    </div>
                                </div>

                                <div className='flex gap-7 items-center mt-1'>
                                    <div className='w-22 text-center border-1 border-black rounded bg-white dark:bg-black'>
                                        <div className='flex justify-center gap-2'>
                                            <p className='text-[9px] text-gray-500'>Plate Number</p>
                                        </div>
                                        <p className='license-font text-xl font-bold'>{props.selectedVehicle.plate_number.replace("-", "")}</p>
                                    </div>

                                    <Button variant="ghost" className='text-gray-600'>Documents<ExternalLink /></Button>
                                </div>
                            </div>
                            <figure>
                                <img className='h-40 me-15 mx-auto rotate-y-180' src={VehicleImage} alt={props.selectedVehicle.model} />
                            </figure>
                        </div>

                        <div>
                            <div>
                                <div className='flex justify-between item-center my-5'>
                                    <p className='font-semibold'>History</p>
                                </div>

                                <div>
                                    {props.reservations.map((reservation, index) => {

                                        const startLoc = reservation.pickup_address.split(',')[0] + ", " + reservation.pickup_address.split(",").at(-4) + " ";
                                        const endLoc = reservation.dropoff_address.split(',')[0] + ", " + reservation.dropoff_address.split(",").at(-4);
                                        const currently_dispatched = new Date(reservation.dispatch.schedule).toLocaleDateString('default') == new Date().toLocaleDateString('default') && reservation.status == "DISPATCHED";
                                        
                                 

                                        return (
                                            <div key={index}>
                                                <div className='flex items-center gap-2 overflow-hidden mb-2 '>
                                                    <p className='text-sm text-nowrap'>
                                                        {currently_dispatched ? "NOW ON THE WAY" : reservation.dispatch.schedule}
                                                    </p>
                                                    <Separator />
                                                </div>

                                                <div key={index} className='my-4'>
                                                    <p className='text-sm '>ID &nbsp;
                                                        <span className='id-code-font'>
                                                            {
                                                                reservation.reservation_id
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className='flex items-center gap-2 mb-2 text-xs text-nowrap text-gray-500 overflow-hidden text-ellipsis'>
                                                        {startLoc}
                                                        <ArrowRight size={12} />
                                                        {endLoc}
                                                    </p>
                                                    {
                                                        currently_dispatched &&
                                                        <div className='rounded overflow-hidden' style={{ height: "220px", width: "100%" }}>
                                                            <MapRoute reservation={reservation} padding={0} />
                                                        </div>
                                                    }

                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>



                            </div>
                        </div>
                    </div>
                </FleetmanagementLayout>
            </AppLayout>
        </SidebarProvider>
    )
}

export default FleetDetails
