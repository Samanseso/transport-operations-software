import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { type PropsWithChildren } from 'react';

interface CreateReservationLayoutProps {

}



export default function ReservationDetailsLayout({ children }: PropsWithChildren<CreateReservationLayoutProps>) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }
    const currentPath = window.location.pathname;



    return (
        <div className="p-4">

            <div className="flex-1 relative">
                <section>{children}</section>
            </div>

        </div>
    );
}

