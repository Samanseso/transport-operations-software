import MapRoute from '@/components/map-route';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/task';
import { BreadcrumbItem, Reservation, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { LatLng } from 'leaflet';
import { Camera, CheckCircle2, FileCheck, Locate, LocateFixed, MapPin, Navigation, Phone, Send, ShieldAlert, Radio } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import StatusTag from '@/components/status-tag';

interface Waypoint {
    address: string;
    latlng: string;
    consignee_name?: string;
    consignee_phone?: string;
    instructions?: string;
    status?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver Workspace',
        href: '/driver/dashboard',
    },
    {
        title: 'Task Details & POD',
        href: index().url,
    },
];

export default function TaskDetails() {
    const { props } = usePage<{ reservation: Reservation; auth: { user: User } }>();
    const waybill = props.reservation;
    const waypoints: Waypoint[] =
        waybill.waypoints && waybill.waypoints.length > 0
            ? waybill.waypoints
            : [
                  {
                      address: waybill.dropoff_address,
                      latlng: waybill.dropoff_latlng,
                      consignee_name: waybill.customer?.name,
                      consignee_phone: '0917-000-0000',
                  },
              ];

    // Find current active waypoint index
    const activeWaypointIdx = waypoints.findIndex((wp) => !wp.status || (wp.status !== 'DELIVERED' && wp.status !== 'FAILED'));
    const currentWaypointIndex = activeWaypointIdx !== -1 ? activeWaypointIdx : Math.max(0, waypoints.length - 1);
    const activeWaypoint = waypoints[currentWaypointIndex];

    const [position, setPosition] = useState<LatLng | null>(null);
    const [status, setStatus] = useState<string>(waybill.status || 'PENDING');
    const [geoError, setGeoError] = useState<string | null>(null);
    const [driverFocus, setDriverFocus] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // POD Modal State
    const [isPodModalOpen, setIsPodModalOpen] = useState(false);
    const [outcome, setOutcome] = useState<'SUCCESS' | 'FAILED'>('SUCCESS');
    const [recipientName, setRecipientName] = useState(activeWaypoint?.consignee_name || waybill.customer?.name || '');
    const [signatureDataUrl, setSignatureDataUrl] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [reasonCode, setReasonCode] = useState('Recipient Unavailable');

    const getNextAction = (current: string) => {
        if (!current || current === 'ASSIGNED' || current === 'PENDING') {
            return { label: 'To Pickup', status: 'DRIVER_EN_ROUTE_TO_PICKUP' };
        }
        if (current === 'DRIVER_EN_ROUTE_TO_PICKUP' || current === 'GOING TO PICKUP' || current === 'GOING_TO_PICKUP') {
            return { label: 'At Pickup', status: 'ARRIVED_AT_PICKUP' };
        }
        if (current === 'ARRIVED_AT_PICKUP') {
            return { label: 'Cargo Loaded', status: 'CARGO_LOADED' };
        }
        if (current === 'CARGO_LOADED' || current === 'IN_TRANSIT') {
            return {
                label: `At Stop #${currentWaypointIndex + 1}`,
                status: 'ARRIVED_AT_DROPOFF',
            };
        }
        if (current === 'ARRIVED_AT_DROPOFF') {
            return {
                label: `Sign POD Stop #${currentWaypointIndex + 1}`,
                status: 'POD_SIGN_OFF',
            };
        }
        return null;
    };

    const nextAction = getNextAction(status);

    const requestLocationPermission = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser.');
            setIsLocationModalOpen(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos = new LatLng(latitude, longitude);
                setPosition(newPos);
                setGeoError(null);
                setIsLocationModalOpen(false);

                axios
                    .post(update().url, {
                        vehicle_id: waybill.dispatch?.vehicle_id || waybill.reservation_id,
                        latitude,
                        longitude,
                    })
                    .catch(console.error);
            },
            (err) => {
                setGeoError('Location permission denied or unavailable.');
                setIsLocationModalOpen(true);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    };

    const handleStatusUpdate = () => {
        if (!nextAction) return;

        if (nextAction.status === 'POD_SIGN_OFF') {
            setIsPodModalOpen(true);
            return;
        }

        router.post(
            `/tasks/${waybill.reservation_id}/status`,
            { status: nextAction.status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStatus(nextAction.status);
                },
            },
        );
    };

    const handlePodSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            `/tasks/${waybill.reservation_id}/waypoint/${currentWaypointIndex}/pod`,
            {
                outcome,
                pod_recipient_name: recipientName,
                pod_signature_url: signatureDataUrl || null,
                pod_photo_url: photoUrl || null,
                reason_code: outcome === 'FAILED' ? reasonCode : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsPodModalOpen(false);
                    if (currentWaypointIndex >= waypoints.length - 1) {
                        setStatus(outcome === 'SUCCESS' ? 'DELIVERED' : 'PARTIAL_DELIVERY');
                    } else {
                        setStatus('IN_TRANSIT');
                    }
                },
            },
        );
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser.');
            return;
        }

        // Check permission status if API is available
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((result) => {
                    if (result.state === 'prompt') {
                        setIsLocationModalOpen(true);
                    } else if (result.state === 'denied') {
                        setGeoError('Location permission denied.');
                        setIsLocationModalOpen(true);
                    } else {
                        requestLocationPermission();
                    }
                })
                .catch(() => {
                    requestLocationPermission();
                });
        } else {
            requestLocationPermission();
        }

        const interval = setInterval(requestLocationPermission, 10000);
        return () => clearInterval(interval);
    }, [waybill.dispatch?.vehicle_id]);

    const waybillNo = waybill.waybill_number || `WB-${waybill.reservation_id.slice(0, 8).toUpperCase()}`;

    return (
        <SidebarProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                {/* Location Permission Dialog Modal */}
                {isLocationModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 transition-all">
                        <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 mb-4">
                                <Radio className="h-6 w-6 animate-pulse" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enable GPS Location Access</h3>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                The driver app requires real-time GPS location access to update delivery telemetry, report turn-by-turn routing, and record Proof of Delivery (e-POD).
                            </p>
                            <div className="mt-5 flex flex-col gap-2">
                                <Button
                                    type="button"
                                    onClick={requestLocationPermission}
                                    className="w-full bg-sky-600 hover:bg-sky-700 active:scale-[0.98] font-bold text-xs text-white"
                                >
                                    Allow GPS Location Access
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsLocationModalOpen(false)}
                                    className="w-full text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                    Dismiss for Now
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Responsive Grid Layout (Mobile-first vertical stack, Laptop/Tablet split view) */}
                <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] w-full overflow-hidden bg-slate-950">
                    {/* Interactive GIS Map Area */}
                    <div className="relative flex-1 h-[45vh] lg:h-full w-full bg-slate-900">
                        {geoError && (
                            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/90 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg backdrop-blur-md">
                                <span className="flex items-center gap-1.5">
                                    <ShieldAlert className="h-4 w-4" /> {geoError}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="h-6 rounded-lg bg-slate-950 px-2 text-[10px] font-bold text-white hover:bg-slate-900"
                                >
                                    Enable GPS
                                </Button>
                            </div>
                        )}

                        <Button
                            className="absolute right-4 bottom-4 z-20 bg-slate-900/90 text-white border border-slate-700 shadow-xl backdrop-blur-md"
                            size="icon"
                            variant="outline"
                            onClick={() => setDriverFocus(!driverFocus)}
                            title="Toggle Driver Location Lock"
                        >
                            {driverFocus ? <LocateFixed className="h-4 w-4 text-sky-400" /> : <Locate className="h-4 w-4" />}
                        </Button>

                        <MapRoute reservation={waybill} initialDriverLoc={position} padding={0} driverFocus={driverFocus} />
                    </div>

                    {/* Responsive Task Execution Sidebar / Bottom Panel */}
                    <div className="w-full lg:w-[420px] flex-1 lg:flex-initial overflow-y-auto bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800">
                        <div className="space-y-4">
                            {/* Waybill Header Card */}
                            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                                <div>
                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{waybillNo}</span>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                                        {waybill.customer?.name || waybill.customer_name || 'Consignee Order'}
                                    </h2>
                                </div>
                                <StatusTag text={status} />
                            </div>

                            {/* Waypoint Progress Banner */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                                        Stop {currentWaypointIndex + 1} of {waypoints.length}
                                    </span>
                                    <a
                                        href={`tel:${activeWaypoint?.consignee_phone || '0917-000-0000'}`}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                                    >
                                        <Phone className="h-4 w-4" />
                                    </a>
                                </div>
                                <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                                    {activeWaypoint?.consignee_name || 'Recipient'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{activeWaypoint?.address}</p>
                            </div>

                            {/* Origin to Destination Address */}
                            <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <div className="truncate">
                                        <span className="block text-[10px] text-slate-500">Pick-up Origin</span>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{waybill.pickup_address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Navigation className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                                    <div className="truncate">
                                        <span className="block text-[10px] text-slate-500">Dropoff Destination</span>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{waybill.dropoff_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Gate / Delivery Note */}
                            {activeWaypoint?.instructions && (
                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                                    💡 Gate Note: <span className="font-semibold text-slate-900 dark:text-white">{activeWaypoint.instructions}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Stage Button */}
                        <div className="pt-4 mt-auto">
                            {nextAction ? (
                                <Button
                                    onClick={handleStatusUpdate}
                                    className="w-full h-12 text-sm font-bold bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white shadow-md transition-all flex items-center justify-center gap-2 rounded-xl"
                                >
                                    <Send className="h-4 w-4" />
                                    {nextAction.label}
                                </Button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-emerald-700 font-bold text-xs ring-1 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    All Multi-Stop Waypoints Completed!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Per-Waypoint Parameterized POD Modal */}
                    {isPodModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all">
                            <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-md text-slate-900 dark:border-slate-800 dark:bg-slate-900/95 dark:text-white">
                                <div className="flex items-center gap-2 text-sky-600">
                                    <FileCheck className="h-6 w-6" />
                                    <h3 className="text-base font-bold">Stop #{currentWaypointIndex + 1} POD Sign-off</h3>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">Record proof of delivery for {activeWaypoint?.consignee_name || 'consignee'}.</p>

                                <form onSubmit={handlePodSubmit} className="mt-4 space-y-4 text-xs">
                                    <div>
                                        <label className="block font-semibold">Delivery Outcome</label>
                                        <div className="mt-1 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setOutcome('SUCCESS')}
                                                className={`flex-1 rounded-lg py-2 font-bold transition-all ${
                                                    outcome === 'SUCCESS'
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                }`}
                                            >
                                                Success
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOutcome('FAILED')}
                                                className={`flex-1 rounded-lg py-2 font-bold transition-all ${
                                                    outcome === 'FAILED'
                                                        ? 'bg-rose-600 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                }`}
                                            >
                                                Failed
                                            </button>
                                        </div>
                                    </div>

                                    {outcome === 'SUCCESS' ? (
                                        <>
                                            <div>
                                                <label className="block font-semibold">Recipient Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={recipientName}
                                                    onChange={(e) => setRecipientName(e.target.value)}
                                                    className="mt-1 w-full rounded-lg border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                                />
                                            </div>

                                            <div>
                                                <label className="block font-semibold">Digital Signature URL / Data</label>
                                                <input
                                                    type="text"
                                                    placeholder="data:image/png;base64,..."
                                                    value={signatureDataUrl}
                                                    onChange={(e) => setSignatureDataUrl(e.target.value)}
                                                    className="mt-1 w-full rounded-lg border p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block font-semibold">Failure Reason Code</label>
                                            <select
                                                value={reasonCode}
                                                onChange={(e) => setReasonCode(e.target.value)}
                                                className="mt-1 w-full rounded-lg border p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                                            >
                                                <option value="Recipient Unavailable">Recipient Unavailable</option>
                                                <option value="Refused Delivery">Refused Delivery</option>
                                                <option value="Address Unreachable">Address Unreachable</option>
                                                <option value="Damaged Goods">Damaged Goods</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button type="button" variant="outline" onClick={() => setIsPodModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className={outcome === 'SUCCESS' ? 'bg-emerald-600 hover:bg-emerald-700 font-bold' : 'bg-rose-600 hover:bg-rose-700 font-bold'}
                                        >
                                            Confirm Stop Sign-off
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </SidebarProvider>
    );
}
