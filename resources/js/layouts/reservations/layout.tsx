import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';



export default function ReservationsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="h-full p-4">
            <div className="h-full flex flex-col lg:flex-row lg:space-x-12">
                <Separator className="my-6 hidden" />
                
                <div className="flex-1">
                    <section className="h-full">{children}</section>
                </div>
            </div>
        </div>
    );
}
