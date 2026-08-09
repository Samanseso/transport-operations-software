import { Separator } from '@/components/ui/separator';
import { type PropsWithChildren } from 'react';

export default function ReservationsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="h-full p-6">
            <div className="flex h-full flex-col lg:flex-row lg:space-x-12">
                <Separator className="my-6 hidden" />

                <div className="flex-1">
                    <section className="h-full">{children}</section>
                </div>
            </div>
        </div>
    );
}
