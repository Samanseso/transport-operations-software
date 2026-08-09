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

import { CustomerCombobox } from '@/components/customer-combobox';

const transportOptions = [
    "Leisure / Personal Transport",
    "Corporate / Institutional Transport",
    "Relocation Services",
    "Event Transport",
    "Cargo / Delivery Services",
    "Private Shuttle Service",
]


const Details = () => {
    const page = usePage<SharedData & {
        customer_id: string | undefined,
        customers?: { id: string | number; name: string; email: string }[],
        service_type: string | undefined,
        time: string | undefined,
        cargo_details: string | undefined,
        special_instructions: string | undefined,
        edit_mode?: boolean,
        edit_reservation_id?: string,
    }>();

    const { props } = page;
    const userRole = props.auth?.user?.role || 'CUSTOMER';
    const isCustomerRole = userRole === 'CUSTOMER';

    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);
    const editId = props.edit_reservation_id;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservations', href: '/reservations' },
        {
            title: editMode ? 'Edit' : 'Create',
            href: editMode ? `/reservations/${editId}/edit` : '/reservations/create/select',
        },
    ];

    const [selectedService, setSelectedService] = useState<string | undefined>(props.service_type);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
        props.customer_id || (isCustomerRole ? String(props.auth?.user?.id || '') : '')
    );

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
                                {isCustomerRole ? (
                                    <input type="hidden" name="customer_id" value={props.auth?.user?.id} />
                                ) : (
                                    <div className="space-y-6">
                                        <HeadingSmall
                                            title="Customer Account"
                                            description="Search and tag target client for this booking"
                                        />
                                        <div className="grid gap-2">
                                            <Label>Client / Account *</Label>
                                            <CustomerCombobox
                                                customers={props.customers || []}
                                                selectedCustomerId={selectedCustomerId}
                                                onSelectCustomer={setSelectedCustomerId}
                                            />
                                            <InputError message={errors.customer_id} />
                                        </div>
                                    </div>
                                )}

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
                                    <HeadingSmall title="Cargo & Payload Specifications" description="Enter cargo category, weight, and handling notes" />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cargo_type">Cargo Category / Classification</Label>
                                            <Select name="cargo_type" defaultValue="General Freight">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Cargo Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General Freight">📦 General Freight</SelectItem>
                                                    <SelectItem value="Dry Goods">🧱 Dry Goods & Construction</SelectItem>
                                                    <SelectItem value="Cold Chain">❄️ Cold Chain / Perishables</SelectItem>
                                                    <SelectItem value="Fragile">🍷 Fragile / Glassware</SelectItem>
                                                    <SelectItem value="Heavy Equipment">🏗️ Heavy Equipment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="cargo_weight_kg">Estimated Cargo Weight (kg) *</Label>
                                            <Input
                                                id="cargo_weight_kg"
                                                type="number"
                                                min="0"
                                                name="cargo_weight_kg"
                                                defaultValue="100"
                                                placeholder="e.g. 500"
                                                required
                                            />
                                            <InputError className="mt-1" message={errors.cargo_weight_kg} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cargo_details">Cargo description & dimensions</Label>

                                        <Input
                                            id="cargo_details"
                                            className="mt-1 block w-full"
                                            defaultValue={props.cargo_details}
                                            name="cargo_details"
                                            placeholder="Description, pallet count, dimensions..."
                                            required={false}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="special_instructions">Special handling instructions</Label>

                                        <Input
                                            id="special_instructions"
                                            className="mt-1 block w-full"
                                            defaultValue={props.special_instructions}
                                            name="special_instructions"
                                            placeholder="Time windows, site gate access, fork-lift needed..."
                                            required={false}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>Save & Proceed</Button>
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
