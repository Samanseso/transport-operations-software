import React, { useState } from 'react';
import { usePage, Form, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BreadcrumbItem, SharedData } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { CustomerCombobox } from '@/components/customer-combobox';
import { UserCheck, Phone, FileText, Package } from 'lucide-react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';

interface WaypointContact {
    address: string;
    latlng: string;
    consignee_name?: string;
    consignee_phone?: string;
    instructions?: string;
}

export default function ConsigneeContacts() {
    const page = usePage<
        SharedData & {
            customer_id: string;
            customers?: { id: string | number; name: string; email: string }[];
            service_type: string;
            special_instructions: string;
            waypoints: WaypointContact[];
            edit_mode?: boolean;
            edit_reservation_id?: string;
        }
    >();

    const { props } = page;
    const userRole = props.auth?.user?.role || 'CUSTOMER';
    const isCustomerRole = userRole === 'CUSTOMER';
    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservations', href: '/reservations' },
        {
            title: editMode ? 'Edit Waybill' : 'Step 3: Consignee Contacts',
            href: '/reservations/create/step/3',
        },
    ];

    const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
        props.customer_id || (isCustomerRole ? String(props.auth?.user?.id || '') : '')
    );

    const [waypoints, setWaypoints] = useState<WaypointContact[]>(props.waypoints || []);

    const handleWaypointContactChange = (index: number, field: keyof WaypointContact, value: string) => {
        const updated = [...waypoints];
        updated[index] = { ...updated[index], [field]: value };
        setWaypoints(updated);
    };

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <Form
                        {...ReservationController.processStep3.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-8 md:max-w-2xl">
                                <div>
                                    <HeadingSmall
                                        title="Step 3: Sender & Consignee Contacts"
                                        description="Enter corporate sender account details and specific receiving consignee contacts for Electronic Proof of Delivery (POD)."
                                    />
                                </div>

                                {/* Sender Corporate Account */}
                                <div className="rounded-xl border bg-slate-50 p-5 space-y-4 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                        <UserCheck className="h-5 w-5" />
                                        <h3 className="font-bold text-sm">Overarching Corporate Sender Account</h3>
                                    </div>

                                    {isCustomerRole ? (
                                        <input type="hidden" name="customer_id" value={props.auth?.user?.id} />
                                    ) : (
                                        <div className="grid gap-2">
                                            <Label>Corporate Account Client *</Label>
                                            <CustomerCombobox
                                                customers={props.customers || []}
                                                selectedCustomerId={selectedCustomerId}
                                                onSelectCustomer={setSelectedCustomerId}
                                            />
                                            <input type="hidden" name="customer_id" value={selectedCustomerId} />
                                            <InputError message={errors.customer_id} />
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="service_type">Service Category</Label>
                                        <Select name="service_type" defaultValue={props.service_type || 'Cargo / Delivery Services'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Service Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cargo / Delivery Services">🚚 Cargo / Freight Delivery</SelectItem>
                                                <SelectItem value="Corporate / Institutional Transport">🏢 Corporate Shuttle</SelectItem>
                                                <SelectItem value="Relocation Services">📦 Relocation / Moving</SelectItem>
                                                <SelectItem value="Event Transport">🎪 Event Logistics</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Per-Waypoint Consignee Contacts */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                        <Phone className="h-5 w-5" />
                                        <h3 className="font-bold text-sm">Receiving Consignee Contacts ({waypoints.length} Dropoffs)</h3>
                                    </div>

                                    {waypoints.map((wp, idx) => (
                                        <div key={idx} className="rounded-xl border bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900">
                                            <div className="border-b pb-2">
                                                <span className="rounded bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                    Consignee Stop #{idx + 1}: {wp.address}
                                                </span>
                                            </div>

                                            {/* Hidden waypoint address and latlng */}
                                            <input type="hidden" name={`waypoints[${idx}][address]`} value={wp.address} />
                                            <input type="hidden" name={`waypoints[${idx}][latlng]`} value={wp.latlng} />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label>Receiver Full Name *</Label>
                                                    <Input
                                                        name={`waypoints[${idx}][consignee_name]`}
                                                        value={wp.consignee_name || ''}
                                                        onChange={(e) => handleWaypointContactChange(idx, 'consignee_name', e.target.value)}
                                                        placeholder="Name of receiving person"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Receiver Phone Number *</Label>
                                                    <Input
                                                        name={`waypoints[${idx}][consignee_phone]`}
                                                        value={wp.consignee_phone || ''}
                                                        onChange={(e) => handleWaypointContactChange(idx, 'consignee_phone', e.target.value)}
                                                        placeholder="0917-XXX-XXXX"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Dropoff Gate / Dock Instructions</Label>
                                                <Input
                                                    name={`waypoints[${idx}][instructions]`}
                                                    value={wp.instructions || ''}
                                                    onChange={(e) => handleWaypointContactChange(idx, 'instructions', e.target.value)}
                                                    placeholder="e.g. Leave at loading dock 4, call upon arrival"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="special_instructions">General Dispatch Special Instructions</Label>
                                    <Input
                                        id="special_instructions"
                                        name="special_instructions"
                                        defaultValue={props.special_instructions}
                                        placeholder="Overall site rules, gate permits, etc."
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/reservations/create/step/2">← Back to Fleet Allocation</Link>
                                    </Button>

                                    <Button disabled={processing} className="bg-sky-600 hover:bg-sky-700 text-white">
                                        Next: Review Fare & Waybill →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </CreateReservationLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
