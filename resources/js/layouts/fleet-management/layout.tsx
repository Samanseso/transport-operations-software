import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Vehicle, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Truck, MapPin, MapPinned, ClipboardPen, NotepadText, FileSearch } from 'lucide-react';
import { type PropsWithChildren } from 'react';

import AvatarImageSource from '../../../../public/assets/images/avatar.png';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import SearchBar from '@/components/search-bar';
import { index, show } from '@/routes/fleet';


interface FleetmanagementLayoutProps {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle;
}



export default function FleetmanagementLayout({ children, vehicles, selectedVehicle }: PropsWithChildren<FleetmanagementLayoutProps>) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }
    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:space-x-4">
                <aside className="w-full max-w-xl lg:w-65">
                    <nav className="flex flex-col space-y-3 space-x-0">
                        <Link href={index()}>
                            <Button variant="secondary" className='w-full justify-start'>
                                <FileSearch />
                                Overview
                            </Button>
                        </Link>

                        <SearchBar />
                        {vehicles.map((vehicle, index) => {
                            return (
                                <Link as="div" href={show(vehicle.vehicle_id)} key={index}
                                    className={cn('flex items-center gap-2 mb-1 mt-0 p-1.5 rounded-md cursor-pointer hover:bg-muted', {
                                        'bg-muted': vehicle.vehicle_id === selectedVehicle?.vehicle_id || "",
                                    })}
                                >
                                    <Avatar className='size-10'>
                                        <AvatarImage src={AvatarImageSource} />
                                    </Avatar>
                                    <div className='flex-1'>
                                        <div className='flex items-center justify-between'>
                                            <p className="text-sm">{vehicle.driver.name}</p>
                                            <p className='text-xs text-gray-500'>{vehicle.status}</p>
                                        </div>
                                        <p className='text-xs text-gray-500'>{vehicle.model}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 relative">
                    <section>{children}</section>
                </div>
            </div>
        </div>
    );
}

