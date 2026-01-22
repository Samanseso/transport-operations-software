import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Reservation, VehicleLocation } from "@/types";
import { ReactNode, useEffect, useState } from "react";

import { FlagTriangleRight, Timer, Waypoints, CornerDownRight, ChevronDown, Star } from 'lucide-react';

import { Badge } from './ui/badge';
import StatusTag from './status-tag';
import L, { LatLng } from 'leaflet';
import RoutingMachine from './routing-machine';

import '../bootstrap';
import { getRoutes } from '@/lib/utils';
import RoutePolyline from './route-polyline';
import LiveVehicleLocation from './live-vehicle-location';

interface MapRouteProps {
    reservation: Reservation;
    padding: number;

}

interface routeSummary {
    text: string;
    value: number;
    icon: ReactNode;
}


const MapRoute = ({ reservation, padding }: MapRouteProps) => {


    const [vehicleLoc, setVehicleLoc] = useState<LatLng>(new LatLng(14.577499898900426, 121.10226399999999));
    const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
    const waypoints = [
        new LatLng(parseFloat(reservation.pickup_latlng.split(",")[0]), parseFloat(reservation.pickup_latlng.split(",")[1])),
        new LatLng(parseFloat(reservation.dropoff_latlng.split(",")[0]), parseFloat(reservation.dropoff_latlng.split(",")[1])),
    ]

    useEffect(() => {

        const interval = setInterval(() => {
            setVehicleLoc(prev => new LatLng(prev.lat - 0.00005, prev.lng - 0.00005))
        }, 500)

        getRoutes(
            vehicleLoc,
            waypoints
        )
            .then(res => {
                setRoutePoints(res);
            })
            .catch(err => {
                console.log(err)
            })



        const channel = window.Echo.channel("vehicles");

        channel.listen(".VehicleLocationUpdated", (e: VehicleLocation) => {
            setVehicleLoc(new LatLng(e.lat, e.lng));
        });

        return () => {
            clearInterval(interval);
            try { (window as any).Echo.leaveChannel("vehicles"); } catch { }
        };

    }, []);

    const setBounds = (map: L.Map, bounds: L.LatLngBounds) => {
        map.fitBounds(bounds, {
            paddingTopLeft: [0, 0],
            paddingBottomRight: [0, 70]
        });

    }


    return (
            
                

                    <MapContainer center={vehicleLoc} zoom={15} scrollWheelZoom={false} className='z-0'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        />
                        

                        {routePoints.length > 0 && (
                            <RoutePolyline routePoints={routePoints} driverPos={vehicleLoc} setBounds={setBounds} />
                        )}

                        {vehicleLoc && <LiveVehicleLocation vehicleLoc={vehicleLoc} />}

                        <Marker position={waypoints[0]} />
                        <Marker position={waypoints[1]} />

                    </MapContainer>
              
            


    )
}

export default MapRoute