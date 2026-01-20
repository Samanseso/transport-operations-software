import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Truck, MapPin, MapPinned, ClipboardPen, NotepadText } from 'lucide-react';
import { type PropsWithChildren } from 'react';

import { useNewReservation } from '@/components/context/new-reservation-context';
import { step } from '@/routes/reservations';

interface CreateReservationLayoutProps {

}



export default function CreateReservationLayout({ children }: PropsWithChildren<CreateReservationLayoutProps>) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }
    const currentPath = window.location.pathname;

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Date & Vehicle',
            href: step("1"),
            icon: Truck,
        },
        {
            title: ' Pick-up',
            href: step("2"),
            icon: MapPin,
        },
        {
            title: 'Drop-off',
            href: step("3"),
            icon: MapPinned,
        },
        {
            title: 'Details',
            href: step("4"),
            icon: ClipboardPen,
        },
        {
            title: 'Summary',
            href: step("5"),
            icon: NotepadText,
        },
    ];


    return (
        <div className="px-4 py-6">
            <Heading title="Create Reservation" description="Follow the steps to create a new reservation." />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            return (

                                <Button
                                    key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                    })}
                                >

                                    <Link href={item.href} preserveState={false}>
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        {item.title}
                                    </Link>
                                </Button>
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

