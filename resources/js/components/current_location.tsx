import L, { LatLng } from 'leaflet';
import { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import TruckLogo from '../../../public/assets/images/truck.png';

const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-truck-marker',
    html: `<div style="width:60px; height:60px; display:flex; align-items:center; justify-content:center;">
             <img src="${TruckLogo}" alt="Truck" style="width:60px; height:60px; object-fit:contain; filter:drop-shadow(0px 3px 6px rgba(0,0,0,0.4));" />
           </div>`,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
});

interface CurrentLocationProps {
    position: LatLng;
    setBounds: (map: L.Map, bounds: LatLng) => void;
}

const CurrentLocation = ({ position, setBounds }: CurrentLocationProps) => {
    const map = useMap();
    
    useEffect(() => {
        setBounds(map, position);
    }, [position]);

    return (
        <Marker position={position} icon={vehicleIcon} />
    );
};

export default CurrentLocation;