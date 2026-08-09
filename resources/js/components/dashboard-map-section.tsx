import { Reservation, VehicleLocation } from '@/types';
import L, { LatLng } from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import '../bootstrap';
import LiveVehicleLocation from './live-vehicle-location';
import StatusTag from './status-tag';

interface DashboardMapSectionProps {
    dispatches: Reservation[];
}

const DEFAULT_CENTER = new LatLng(14.5885, 120.9691);

const ROUTE_COLORS = [
    '#0284c7', // Sky Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#e11d48', // Rose
];

// Active Dispatches Map Marker Pins (Identical to active dispatches map)
const pickupIcon = L.divIcon({
    className: 'custom-pickup-marker-badge',
    html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="background-color: #10B981; color: white; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px; font-family: system-ui, sans-serif; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
                <span style="width: 7px; height: 7px; background-color: white; border-radius: 50%; display: inline-block;"></span>
                PICKUP
            </div>
            <div style="width: 2px; height: 10px; background-color: #10B981; margin-top: -1px;"></div>
        </div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -36],
});

const dropoffIcon = L.divIcon({
    className: 'custom-dropoff-marker-badge',
    html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="background-color: #EF4444; color: white; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px; font-family: system-ui, sans-serif; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
                <span style="width: 7px; height: 7px; background-color: white; border-radius: 50%; display: inline-block;"></span>
                DROPOFF
            </div>
            <div style="width: 2px; height: 10px; background-color: #EF4444; margin-top: -1px;"></div>
        </div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -36],
});

function AutoFitAllBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
    const map = useMap();

    useEffect(() => {
        if (bounds && bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 14,
                animate: true,
            });
        }
    }, [bounds, map]);

    return null;
}

const getDriverPos = (disp: Reservation, liveVehicleLocations: Record<string, LatLng>): LatLng | null => {
    const vehicleId = disp.dispatch?.vehicle_id;
    if (vehicleId && liveVehicleLocations[vehicleId]) {
        return liveVehicleLocations[vehicleId];
    }

    const v = disp.dispatch?.vehicle as any;
    if (v) {
        const latRaw = v.latitude ?? v.lat;
        const lngRaw = v.longitude ?? v.lng;
        if (latRaw !== undefined && lngRaw !== undefined && latRaw !== null && lngRaw !== null) {
            const lat = parseFloat(String(latRaw));
            const lng = parseFloat(String(lngRaw));
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                return new LatLng(lat, lng);
            }
        }
    }
    return null;
};

const getDispatchPoints = (disp: Reservation, liveVehicleLocations: Record<string, LatLng>): LatLng[] => {
    const pts: LatLng[] = [];

    // Driver location if available
    const driverPos = getDriverPos(disp, liveVehicleLocations);
    if (driverPos) {
        pts.push(driverPos);
    }

    // Pickup location
    if (disp.pickup_latlng) {
        const p = disp.pickup_latlng.split(',');
        if (p.length === 2 && !isNaN(parseFloat(p[0])) && !isNaN(parseFloat(p[1]))) {
            pts.push(new LatLng(parseFloat(p[0]), parseFloat(p[1])));
        }
    }

    // Waypoints if present
    if (disp.waypoints && Array.isArray(disp.waypoints)) {
        disp.waypoints.forEach((wp) => {
            if (wp.latlng) {
                const parts = wp.latlng.split(',');
                if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                    pts.push(new LatLng(parseFloat(parts[0]), parseFloat(parts[1])));
                }
            }
        });
    }

    // Dropoff location
    if (disp.dropoff_latlng) {
        const d = disp.dropoff_latlng.split(',');
        if (d.length === 2 && !isNaN(parseFloat(d[0])) && !isNaN(parseFloat(d[1]))) {
            pts.push(new LatLng(parseFloat(d[0]), parseFloat(d[1])));
        }
    }

    return pts;
};

export default function DashboardMapSection({ dispatches }: DashboardMapSectionProps) {
    const [routesMap, setRoutesMap] = useState<Record<string, LatLng[]>>({});
    const [liveVehicleLocations, setLiveVehicleLocations] = useState<Record<string, LatLng>>({});

    // Listen for live vehicle location broadcasts via Echo / Reverb (identical to active dispatches)
    useEffect(() => {
        const echo = (window as any).Echo;
        if (!echo || typeof echo.channel !== 'function') return;

        const channel = echo.channel('vehicles');
        channel.listen('.VehicleLocationUpdated', (e: VehicleLocation) => {
            if (e.vehicle_id && e.lat && e.lng) {
                setLiveVehicleLocations((prev) => ({
                    ...prev,
                    [e.vehicle_id]: new LatLng(e.lat, e.lng),
                }));
            }
        });

        return () => {
            try {
                echo.leaveChannel('vehicles');
            } catch {}
        };
    }, []);

    // Calculate all points (Driver + Pickup + Dropoff) across dispatches for map bounding box
    const allBounds = useMemo(() => {
        const points: LatLng[] = [];
        dispatches.forEach((disp) => {
            const pts = getDispatchPoints(disp, liveVehicleLocations);
            points.push(...pts);
        });

        if (points.length === 0) return null;
        return L.latLngBounds(points);
    }, [dispatches, liveVehicleLocations]);

    // Fetch OSRM Road geometries for each active dispatch
    useEffect(() => {
        dispatches.forEach((disp) => {
            const pts = getDispatchPoints(disp, liveVehicleLocations);
            if (pts.length < 2) return;

            const coordsStr = pts.map((p) => `${p.lng},${p.lat}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data.routes && data.routes[0]) {
                        const coords: [number, number][] = data.routes[0].geometry.coordinates;
                        const routeLatLngs = coords.map(([lng, lat]) => new LatLng(lat, lng));
                        setRoutesMap((prev) => ({
                            ...prev,
                            [disp.reservation_id]: pts.length > 0 ? [pts[0], ...routeLatLngs] : routeLatLngs,
                        }));
                    } else {
                        setRoutesMap((prev) => ({
                            ...prev,
                            [disp.reservation_id]: pts,
                        }));
                    }
                })
                .catch(() => {
                    setRoutesMap((prev) => ({
                        ...prev,
                        [disp.reservation_id]: pts,
                    }));
                });
        });
    }, [dispatches, liveVehicleLocations]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Full Width Map Container */}
            <div className="relative h-[442px] w-full bg-slate-100 dark:bg-slate-950">
                <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                    />

                    <AutoFitAllBounds bounds={allBounds} />

                    {dispatches.map((disp, index) => {
                        const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
                        const pts = getDispatchPoints(disp, liveVehicleLocations);
                        const routePath = routesMap[disp.reservation_id] || pts;

                        const waybillNo = disp.waybill_number || `WB-${disp.reservation_id.slice(0, 8).toUpperCase()}`;
                        const driverPos = getDriverPos(disp, liveVehicleLocations);
                        const driverName = disp.dispatch?.vehicle?.driver?.name;
                        const plateNumber = disp.dispatch?.vehicle?.plate_number;

                        // Find pickup & dropoff coordinates
                        const pickupPos = disp.pickup_latlng
                            ? new LatLng(parseFloat(disp.pickup_latlng.split(',')[0]), parseFloat(disp.pickup_latlng.split(',')[1]))
                            : null;
                        const dropoffPos = disp.dropoff_latlng
                            ? new LatLng(parseFloat(disp.dropoff_latlng.split(',')[0]), parseFloat(disp.dropoff_latlng.split(',')[1]))
                            : null;

                        return (
                            <React.Fragment key={disp.reservation_id}>
                                {/* Drawn Polyline Route - Click to show Waybill Code & Details */}
                                {routePath.length > 1 && (
                                    <Polyline positions={routePath} pathOptions={{ color, weight: 6, opacity: 0.85 }}>
                                        <Popup>
                                            <div className="min-w-[200px] space-y-1.5 p-2 text-xs">
                                                <div className="border-b pb-1 font-mono text-sm font-bold" style={{ color }}>
                                                    {waybillNo}
                                                </div>
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {disp.customer?.name || disp.customer_name || 'Valued Client'}
                                                </div>
                                                <div className="space-y-0.5 text-[11px] text-slate-500">
                                                    <div>
                                                        <span className="font-bold text-emerald-600">Pick-up:</span> {disp.pickup_address}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-rose-600">Drop-off:</span> {disp.dropoff_address}
                                                    </div>
                                                    {driverName && (
                                                        <div>
                                                            <span className="font-bold text-sky-600">Driver:</span> {driverName}{' '}
                                                            {plateNumber ? `(${plateNumber})` : ''}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="pt-1">
                                                    <StatusTag text={disp.status} />
                                                </div>
                                            </div>
                                        </Popup>
                                    </Polyline>
                                )}

                                {/* Animated Driver Truck Position Marker (Identical to active dispatches) */}
                                {driverPos && <LiveVehicleLocation vehicleLoc={driverPos} />}

                                {/* PICKUP Marker Pin (Green Badge Marker) */}
                                {pickupPos && (
                                    <Marker position={pickupPos} icon={pickupIcon}>
                                        <Popup>
                                            <div className="space-y-1 p-1 text-xs">
                                                <div className="font-mono font-bold text-emerald-600">{waybillNo} (Pick-up)</div>
                                                <div className="font-semibold text-slate-800">
                                                    {disp.customer?.name || disp.customer_name || 'Client'}
                                                </div>
                                                <div className="text-[11px] text-slate-500">Pick-up: {disp.pickup_address}</div>
                                                <StatusTag text={disp.status} className="mt-1" />
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {/* DROPOFF Marker Pin (Red Badge Marker) */}
                                {dropoffPos && (
                                    <Marker position={dropoffPos} icon={dropoffIcon}>
                                        <Popup>
                                            <div className="space-y-1 p-1 text-xs">
                                                <div className="font-mono font-bold text-rose-600">{waybillNo} (Drop-off)</div>
                                                <div className="text-[11px] text-slate-500">Destination: {disp.dropoff_address}</div>
                                                <StatusTag text={disp.status} className="mt-1" />
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
