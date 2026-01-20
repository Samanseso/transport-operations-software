import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import { useNewReservation } from '@/components/context/new-reservation-context';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout'
import CreateReservationLayout from '@/layouts/create-reservation/layout'
import { step } from '@/routes/reservations';
import { BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reservations',
        href: '/reservations',
    },
    {
        title: 'Create',
        href: '/reservations/create/select',
    },
];


const Summary = () => {

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <Form
                        {...ReservationController.processStep5.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing }) => (
                            <div className='flex gap-3'>

                                <Link href={step(4)} preserveState={false}>
                                    Back to Step 4
                                </Link>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>Save</Button>
                                </div>
                            </div>
                        )}

                    </Form>


                </CreateReservationLayout>
            </AppLayout >
        </SidebarProvider>
    )
}

export default Summary