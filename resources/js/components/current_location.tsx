import { LatLng } from 'leaflet';
import { useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';

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
        <Marker position={position} />
    )
}

export default CurrentLocation