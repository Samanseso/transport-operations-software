import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Reservation, VehicleLocation } from "@/types";
import { useEffect, useState, useMemo } from "react";

import L, { LatLng } from 'leaflet';

import '../bootstrap';
import { getRoutes } from '@/lib/utils';
import RoutePolyline from './route-polyline';
import LiveVehicleLocation from './live-vehicle-location';
import { LoaderCircle } from 'lucide-react';

interface MapRouteProps {
    reservation: Reservation;
    padding?: number;
    driverFocus?: boolean;
    initialDriverLoc?: LatLng | null;
}

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

const MapRoute = ({ reservation, padding = 0, driverFocus = false, initialDriverLoc = null }: MapRouteProps) => {

    const [vehicleLoc, setVehicleLoc] = useState<LatLng | null>(null);
    const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
    const [loadingRoute, setLoadingRoute] = useState(true);

    const pickup = useMemo(() => {
        const parts = reservation.pickup_latlng.split(",");
        return new LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
    }, [reservation.pickup_latlng]);

    const dropoff = useMemo(() => {
        const parts = reservation.dropoff_latlng.split(",");
        return new LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
    }, [reservation.dropoff_latlng]);

    // Priority for driver location: live websocket update, then device initialDriverLoc
    const activeDriverPos = vehicleLoc || initialDriverLoc;

    // listen for driver location updates via Echo/Reverb
    useEffect(() => {
        const echo = (window as any).Echo;
        if (!echo || typeof echo.channel !== "function") return;

        const channel = echo.channel("vehicles");

        channel.listen(".VehicleLocationUpdated", (e: VehicleLocation) => {
            if (e.vehicle_id === reservation.dispatch?.vehicle_id) {
                setVehicleLoc(new LatLng(e.lat, e.lng));
            }
        });

        return () => {
            try { echo.leaveChannel("vehicles"); } catch { }
        };
    }, [reservation.dispatch?.vehicle_id]);

    // fetch route immediately and update when activeDriverPos or pickup/dropoff change
    useEffect(() => {
        const waypoints = activeDriverPos ? [activeDriverPos, pickup, dropoff] : [pickup, dropoff];

        setLoadingRoute(true);
        getRoutes(waypoints)
            .then(res => {
                setRoutePoints(res);
            })
            .catch(err => {
                console.error("Failed to fetch routes:", err);
            })
            .finally(() => {
                setLoadingRoute(false);
            });
    }, [activeDriverPos, pickup, dropoff]);

    const setBounds = (map: L.Map, bounds: L.LatLngBounds) => {
        const safePadding = typeof padding === 'number' ? Math.min(padding, 80) : 50;
        map.flyToBounds(bounds, {
            paddingTopLeft: [safePadding, safePadding],
            paddingBottomRight: [safePadding, safePadding]
        });
    };

    const setCenter = (map: L.Map) => {
        if (activeDriverPos) {
            map.setView(activeDriverPos, 18);
        }
    };

    const mapCenter = activeDriverPos || pickup;

    return (
        <div className="relative w-full h-full min-h-[400px]">
            {loadingRoute && routePoints.length === 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-background/80 text-sm text-muted-foreground backdrop-blur-xs">
                    <LoaderCircle className='h-5 w-5 animate-spin text-primary' />
                    <p>Calculating route...</p>
                </div>
            )}

            <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} className="z-0 w-full h-full min-h-[400px]">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                />

                {routePoints.length > 0 && (
                    <RoutePolyline
                        routePoints={routePoints}
                        driverPos={activeDriverPos}
                        setBounds={setBounds}
                        driverFocus={driverFocus}
                        setCenter={setCenter}
                    />
                )}

                {/* Point 1: Driver Location (Truck) */}
                {activeDriverPos && <LiveVehicleLocation vehicleLoc={activeDriverPos} />}

                {/* Point 2: Pickup Location (Green Badge Marker) */}
                <Marker position={pickup} icon={pickupIcon}>
                    <Popup>
                        <div className="text-xs">
                            <strong className="text-emerald-600 block mb-1">Pickup Location</strong>
                            {reservation.pickup_address}
                        </div>
                    </Popup>
                </Marker>

                {/* Point 3: Dropoff Location (Red Badge Marker) */}
                <Marker position={dropoff} icon={dropoffIcon}>
                    <Popup>
                        <div className="text-xs">
                            <strong className="text-rose-600 block mb-1">Dropoff Location</strong>
                            {reservation.dropoff_address}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapRoute;