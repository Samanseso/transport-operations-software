import { MapContainer, TileLayer } from 'react-leaflet'
import L, { LatLng } from 'leaflet';
import RoutingMachine from './routing-machine';
import { Reservation } from '@/types';

const MapRoutePreview = ({ reservation }: { reservation: Reservation }) => {

    const setBounds = (map: L.Map, bounds: L.LatLngBounds) => {
        map.fitBounds(bounds);
    }

    return (
        <div className='rounded overflow-hidden' style={{ height: "150px", width: "100%" }}>
            <MapContainer center={[14.77255, 120.97353]} zoom={15} scrollWheelZoom={false} className='z-0'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                />
                <RoutingMachine
                    waypoints={[
                        new LatLng(parseFloat(reservation.pickup_latlng.split(",")[0]), parseFloat(reservation.pickup_latlng.split(",")[1])),
                        new LatLng(parseFloat(reservation.dropoff_latlng.split(",")[0]), parseFloat(reservation.dropoff_latlng.split(",")[1])),
                    ]}

                    createMarker={
                        (i: number, wp: L.Routing.Waypoint, nWps: number) => {
                            let popupContent = "";
                            if (i === 0) popupContent = "Pickup: " + reservation.pickup_address;
                            else if (i === nWps - 1) popupContent = "Dropoff: " + reservation.dropoff_address;

                            return L.marker(wp.latLng).bindPopup(popupContent);
                        }
                    }

                    setBounds={setBounds}
                />

            </MapContainer>
        </div>
    )
}

export default MapRoutePreview