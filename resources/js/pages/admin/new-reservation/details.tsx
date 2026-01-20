import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';


import { useEffect, useState } from 'react';
import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { Form, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import { Button } from '@/components/ui/button';
import { Transition } from '@headlessui/react';
import InputError from '@/components/input-error';
import { SidebarProvider } from '@/components/ui/sidebar';

const transportOptions = [
    "Leisure / Personal Transport",
    "Corporate / Institutional Transport",
    "Relocation Services",
    "Event Transport",
    "Cargo / Delivery Services",
    "Private Shuttle Service",
]


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

const Details = () => {

    const { props } = usePage<{
        customer_name: string | undefined,
        email: string | undefined,
        contact: string | undefined,
        service_type: string | undefined,
        time: string | undefined,
        cargo_details: string | undefined,
        special_instructions: string | undefined,
    }>();

    const [selectedService, setSelectedService] = useState<string | undefined>(props.service_type);


    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>

                    <Form
                        {...ReservationController.processStep4.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >

                        {({ processing, errors }) => (
                            <div className='space-y-12 md:max-w-xl'>
                                <div className='space-y-6'>
                                    <HeadingSmall title="Customer information" description="Enter customer name and contact details" />

                                    <div className="grid gap-2">
                                        <Label htmlFor="customer_name">Name</Label>

                                        <Input
                                            id="customer_name"
                                            className="mt-1 block w-full"
                                            defaultValue={props.customer_name || ""}
                                            name="customer_name"
                                            required
                                            placeholder="Full name"
                                        />

                                        <InputError className="mt-2" message={errors.name} />

                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            defaultValue={props.email || ""}
                                            name="email"
                                            required
                                            placeholder="Email address"
                                        />

                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="contact">Contact number</Label>

                                        <Input
                                            id="contact"
                                            type="contact"
                                            className="mt-1 block w-full"
                                            defaultValue={props.contact || ""}
                                            name="contact"
                                            required
                                            placeholder="Email address"
                                        />

                                        <InputError className="mt-2" message={errors.contact} />
                                    </div>
                                </div>

                                <div className='space-y-6'>
                                    <HeadingSmall title="Service and time" description="Select service type and requested date time" />

                                    <div className="grid gap-2">
                                        <Label htmlFor="service">Service type</Label>
                                        <Select name='service_type' defaultValue={selectedService} onValueChange={setSelectedService}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transportOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <InputError className="mt-2" message={errors.service_type} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Requested time</Label>

                                        <Input
                                            id="time"
                                            type="time"
                                            className="mt-1 block w-full"
                                            defaultValue={props.time || ""}
                                            name="time"
                                            required
                                        />

                                        <InputError className="mt-2" message={errors.time} />
                                    </div>
                                </div>


                                <div className='space-y-6'>
                                    <HeadingSmall title="Freight" description="Enter cargo details and other notes" />

                                    <div className="grid gap-2">
                                        <Label htmlFor="cargo_details">Cargo details</Label>

                                        <Input
                                            id="cargo_details"
                                            className="mt-1 block w-full"
                                            defaultValue={props.cargo_details}
                                            name="cargo_details"
                                            placeholder="Description, weight, dimensions..."
                                            required={false}
                                        />



                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="special_instructions">Special insstructions</Label>

                                        <Input
                                            id="special_instructions"
                                            className="mt-1 block w-full"
                                            defaultValue={props.special_instructions}
                                            name="special_instructions"
                                            placeholder="Time windows, site access..."
                                            required={false}
                                        />



                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>Save</Button>
                                    </div>
                                </div>

                            </div>
                        )}

                    </Form>

                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}

export default Details