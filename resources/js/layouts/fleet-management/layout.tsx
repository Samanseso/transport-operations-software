import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Vehicle } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardPen, FileSearch, NotepadText } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';

import SearchBar from '@/components/search-bar';
import { index, show } from '@/routes/fleet';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import AvatarImageSource from '../../../../public/assets/images/avatar.png';

interface FleetmanagementLayoutProps {
    vehicles: Vehicle[];
    selectedVehicle?: Vehicle;
}

export default function FleetmanagementLayout({ children, vehicles, selectedVehicle }: PropsWithChildren<FleetmanagementLayoutProps>) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }
    const currentPath = window.location.pathname;
    const [searchInput, setSearchInput] = useState('');

    const filteredVehicles = vehicles.filter((vehicle) => {
        const query = searchInput.trim().toLowerCase();

        if (!query) {
            return true;
        }

        return [vehicle.vehicle_id, vehicle.plate_number, vehicle.model, vehicle.status, vehicle.driver?.name ?? '']
            .join(' ')
            .toLowerCase()
            .includes(query);
    });

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                <aside className="w-full max-w-xl lg:w-65">
                    <nav className="flex flex-col space-y-2 space-x-0">
                        <Link href={index()}>
                            <Button variant={currentPath.endsWith('/overview') ? 'outline' : 'ghost'} className="w-full justify-start gap-2">
                                <FileSearch className="h-4 w-4" />
                                Overview
                            </Button>
                        </Link>
                        <Link href="/fleet/maintenance">
                            <Button variant={currentPath.includes('/maintenance') ? 'outline' : 'ghost'} className="w-full justify-start gap-2">
                                <ClipboardPen className="h-4 w-4" />
                                Maintenance Logs
                            </Button>
                        </Link>
                        <Link href="/fleet/fuel">
                            <Button variant={currentPath.includes('/fuel') ? 'outline' : 'ghost'} className="w-full justify-start gap-2">
                                <NotepadText className="h-4 w-4" />
                                Fuel Tracking
                            </Button>
                        </Link>

                        <div className="pt-2">
                            <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search driver, plate, model" />
                        </div>
                        {filteredVehicles.map((vehicle, index) => {
                            return (
                                <Link
                                    as="div"
                                    href={show(vehicle.vehicle_id)}
                                    key={index}
                                    className={cn('mt-0 mb-1 flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-muted', {
                                        'bg-muted': vehicle.vehicle_id === selectedVehicle?.vehicle_id || '',
                                    })}
                                >
                                    <Avatar className="size-10">
                                        <AvatarImage src={AvatarImageSource} />
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm">{vehicle.driver?.name ?? 'Unassigned'}</p>
                                            <p className="text-xs text-gray-500">{vehicle.status ?? 'UNKNOWN'}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{vehicle.model}</p>
                                    </div>
                                </Link>
                            );
                        })}
                        {filteredVehicles.length === 0 && (
                            <div className="rounded-md border border-dashed px-3 py-4 text-sm text-gray-500">No vehicles match your search.</div>
                        )}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="relative flex-1">
                    <section>{children}</section>
                </div>
            </div>
        </div>
    );
}
