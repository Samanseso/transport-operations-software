import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ModalType, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Truck, MapPin, ClipboardPen, NotepadText } from 'lucide-react';
import { useEffect, type PropsWithChildren } from 'react';

import { useNewReservation } from '@/components/context/new-reservation-context';
import { step } from '@/routes/reservations';
import { useModal } from '@/components/context/modal-context';
import { Modal } from '@/components/modal';

interface CreateReservationLayoutProps {

}



export default function CreateReservationLayout({ children }: PropsWithChildren<CreateReservationLayoutProps>) {

    const { props } = usePage<{ modal: ModalType; edit_mode?: boolean; edit_reservation_id?: string }>();

    const { content, createModal } = useModal();


    useEffect(() => {
        if (props.modal.status) {
            createModal(props.modal);
        }
    }, [props.modal]);


    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }
    const currentPath = window.location.pathname;

    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);
    const editId = props.edit_reservation_id;

    const stepHref = (stepNum: string) =>
        editMode ? `/reservations/${editId}/edit/step/${stepNum}` : step(stepNum);

    const sidebarNavItems: NavItem[] = [
        {
            title: '1. Route & Stops',
            href: stepHref("1"),
            icon: MapPin,
            roles: ["all"]
        },
        {
            title: '2. Cargo & Fleet',
            href: stepHref("2"),
            icon: Truck,
            roles: ["all"]
        },
        {
            title: '3. Consignee Contacts',
            href: stepHref("3"),
            icon: ClipboardPen,
            roles: ["all"]
        },
        {
            title: '4. Summary & Waybill',
            href: stepHref("4"),
            icon: NotepadText,
            roles: ["all"]
        },
    ];


    return (
        <div className="px-4 py-6">

            <Modal content={content} />

            <Heading
                title={editMode ? "Edit Reservation" : "Create Reservation"}
                description={editMode ? "Update the reservation details." : "Follow the steps to create a new reservation."}
            />

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

