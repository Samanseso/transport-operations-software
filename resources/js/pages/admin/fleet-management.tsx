import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem, SharedData, Vehicle } from '@/types';
import { usePage } from '@inertiajs/react';
import { EllipsisVertical, ExternalLink, FileSearch, MessageCircle, Phone } from 'lucide-react';
import AvatarImageSource from '../../../public/assets/images/avatar.png';
import VehicleImage from '../../../public/assets/images/mitsubishi-l300.png';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import FleetmanagementLayout from '@/layouts/fleet-management/layout';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider } from '@/components/ui/sidebar';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: ""
    },
];


const FleetManagement = () => {
    const props = usePage<{ vehicles: Vehicle[], selectedVehicle: Vehicle }>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <FleetmanagementLayout vehicles={props.vehicles} selectedVehicle={props.selectedVehicle} >
                    123
                </FleetmanagementLayout>
            </AppLayout>
        </SidebarProvider>
    )
}

export default FleetManagement