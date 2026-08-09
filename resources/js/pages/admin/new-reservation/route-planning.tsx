import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import AddressComboBox from '@/components/address-combo-box';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import LocationMarker from '@/components/location-marker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import CreateReservationLayout from '@/layouts/create-reservation/layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { LatLng } from 'leaflet';
import { MapPin, Navigation, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

interface WaypointInput {
    address: string;
    latlng: string;
    consignee_name?: string;
    consignee_phone?: string;
    instructions?: string;
}

const DEFAULT_PICKUP_POS = new LatLng(14.5885, 120.9691);

export default function RoutePlanning() {
    const page = usePage<
        SharedData & {
            pickup_address: string;
            pickup_latlng: string;
            waypoints: WaypointInput[];
            edit_mode?: boolean;
            edit_reservation_id?: string;
        }
    >();

    const { props } = page;
    const editMode = Boolean(props.edit_mode && props.edit_reservation_id);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Reservations', href: '/reservations' },
        {
            title: editMode ? 'Edit Waybill' : 'New Waybill Dispatch',
            href: '/reservations/create/step/1',
        },
    ];

    const [pickupAddress, setPickupAddress] = useState<string | null>(props.pickup_address || 'Metro Manila Port Area, Manila');
    const [pickupPos, setPickupPos] = useState<LatLng>(() => {
        if (props.pickup_latlng) {
            const parts = props.pickup_latlng.split(',');
            if (parts.length === 2) return new LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
        }
        return DEFAULT_PICKUP_POS;
    });
    const [pickupLoading, setPickupLoading] = useState(false);

    const [waypoints, setWaypoints] = useState<WaypointInput[]>(
        props.waypoints && props.waypoints.length > 0
            ? props.waypoints
            : [
                  {
                      address: 'Novaliches Logistics Hub, Quezon City',
                      latlng: '14.7000,121.0333',
                      consignee_name: '',
                      consignee_phone: '',
                      instructions: '',
                  },
              ],
    );

    // Track loading state per waypoint index
    const [wpLoadingMap, setWpLoadingMap] = useState<Record<number, boolean>>({});

    const handleAddWaypoint = () => {
        setWaypoints([
            ...waypoints,
            {
                address: `Dropoff Stop ${waypoints.length + 1}`,
                latlng: '14.6500,121.0500',
                consignee_name: '',
                consignee_phone: '',
                instructions: '',
            },
        ]);
    };

    const handleRemoveWaypoint = (index: number) => {
        if (waypoints.length <= 1) return;
        setWaypoints(waypoints.filter((_, i) => i !== index));
        // Clean up loading state for removed index
        setWpLoadingMap((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const handleWaypointChange = (index: number, field: keyof WaypointInput, value: string) => {
        const updated = [...waypoints];
        updated[index] = { ...updated[index], [field]: value };
        setWaypoints(updated);
    };

    const latlngToString = (pos: LatLng) => `${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`;

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <CreateReservationLayout>
                    <Form
                        {...ReservationController.processStep1.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing, errors }) => (
                            <div className="space-y-8 md:max-w-3xl">
                                <div>
                                    <HeadingSmall
                                        title="Step 1: Multi-Stop Route & Location Planning"
                                        description="Search pickup origin and define destination dropoffs on the map."
                                    />
                                </div>

                                {/* Pickup Origin Section with AddressComboBox and Interactive Map */}
                                <div className="space-y-4 rounded-2xl border bg-slate-50 p-5 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                        <MapPin className="h-5 w-5" />
                                        <h3 className="text-sm font-bold">Pick-up Origin Location</h3>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Search Pick-up Address</Label>
                                        <AddressComboBox
                                            initialAddress={props.pickup_address || null}
                                            selectedAddress={pickupAddress}
                                            setSelectedAddress={setPickupAddress}
                                            position={pickupPos}
                                            setPosition={setPickupPos}
                                            submit={() => {}}
                                            loading={pickupLoading}
                                        />
                                        <input type="hidden" name="pickup_address" value={pickupAddress || ''} />
                                        <input type="hidden" name="pickup_latlng" value={latlngToString(pickupPos)} />
                                        <InputError message={errors.pickup_address} />
                                    </div>

                                    {/* Interactive Leaflet Map for Pickup Marker */}
                                    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
                                        <MapContainer center={pickupPos} zoom={13} scrollWheelZoom={false} style={{ height: '240px', width: '100%' }}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker
                                                initialPosition={pickupPos}
                                                position={pickupPos}
                                                setPosition={setPickupPos}
                                                selectedAddress={pickupAddress}
                                                setSelectedAddress={setPickupAddress}
                                                onLoading={setPickupLoading}
                                            />
                                        </MapContainer>
                                    </div>

                                    <div className="font-mono text-xs text-slate-500">Selected Coordinates: {latlngToString(pickupPos)}</div>
                                </div>

                                {/* Dynamic Dropoff Waypoints Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                            <Navigation className="h-5 w-5" />
                                            <h3 className="text-sm font-bold">Dropoff Destinations ({waypoints.length} Stops)</h3>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddWaypoint}
                                            className="flex items-center gap-1 border-sky-300 text-sky-700 hover:bg-sky-50 dark:text-sky-300"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Dropoff Stop
                                        </Button>
                                    </div>

                                    {waypoints.map((wp, idx) => {
                                        const wpPos = (() => {
                                            if (wp.latlng) {
                                                const parts = wp.latlng.split(',');
                                                if (parts.length === 2) return new LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
                                            }
                                            return new LatLng(14.65, 121.05);
                                        })();

                                        const setWpAddress = (addr: string | null) => {
                                            if (addr) handleWaypointChange(idx, 'address', addr);
                                        };

                                        const setWpPosition = (pos: LatLng | ((prev: LatLng) => LatLng)) => {
                                            const resolved = typeof pos === 'function' ? pos(wpPos) : pos;
                                            handleWaypointChange(idx, 'latlng', `${resolved.lat.toFixed(6)},${resolved.lng.toFixed(6)}`);
                                        };

                                        const setWpLoading = (loading: boolean) => {
                                            setWpLoadingMap((prev) => ({ ...prev, [idx]: loading }));
                                        };

                                        return (
                                            <div key={idx} className="relative space-y-4 rounded-2xl border bg-white p-5 shadow-xs dark:bg-slate-900">
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <span className="rounded bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                        Dropoff Stop #{idx + 1}
                                                    </span>
                                                    {waypoints.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveWaypoint(idx)}
                                                            className="p-1 text-rose-500 hover:text-rose-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* AddressComboBox for dropoff geocoding search */}
                                                <div className="grid gap-2">
                                                    <Label>Search Dropoff Address *</Label>
                                                    <AddressComboBox
                                                        initialAddress={wp.address || null}
                                                        selectedAddress={wp.address || null}
                                                        setSelectedAddress={setWpAddress as any}
                                                        position={wpPos}
                                                        setPosition={setWpPosition as any}
                                                        submit={() => {}}
                                                        loading={!!wpLoadingMap[idx]}
                                                    />
                                                    <input type="hidden" name={`waypoints[${idx}][address]`} value={wp.address || ''} />
                                                    <input type="hidden" name={`waypoints[${idx}][latlng]`} value={wp.latlng || ''} />
                                                </div>

                                                {/* Interactive Leaflet Map for dropoff pin */}
                                                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
                                                    <MapContainer
                                                        center={wpPos}
                                                        zoom={13}
                                                        scrollWheelZoom={false}
                                                        style={{ height: '200px', width: '100%' }}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        />
                                                        <LocationMarker
                                                            initialPosition={wpPos}
                                                            position={wpPos}
                                                            setPosition={setWpPosition as any}
                                                            selectedAddress={wp.address || null}
                                                            setSelectedAddress={setWpAddress as any}
                                                            onLoading={setWpLoading}
                                                        />
                                                    </MapContainer>
                                                </div>

                                                <div className="font-mono text-xs text-slate-500">Coordinates: {wp.latlng || 'Not set'}</div>

                                                <input type="hidden" name={`waypoints[${idx}][consignee_name]`} value={wp.consignee_name || ''} />
                                                <input type="hidden" name={`waypoints[${idx}][consignee_phone]`} value={wp.consignee_phone || ''} />
                                                <input type="hidden" name={`waypoints[${idx}][instructions]`} value={wp.instructions || ''} />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-4">
                                    <Button disabled={processing} className="w-full bg-sky-600 font-bold text-white hover:bg-sky-700 sm:w-auto">
                                        Next: Cargo Specs & Fleet Allocation →
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
