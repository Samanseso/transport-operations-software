import { LatLng } from 'leaflet'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { GeocodeHit } from '../types/index';
import axios from 'axios';
import { getDisplayName } from '@/lib/utils';

interface LocationMarkerProps {
    initialPosition: LatLng;
    position: LatLng;
    setPosition: React.Dispatch<SetStateAction<LatLng>>;
    selectedAddress: string | null;
    setSelectedAddress: React.Dispatch<SetStateAction<string | null>>;
}

const reverseGeocode = async (position: LatLng): Promise<GeocodeHit> => {
    const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`,
        {
            headers: { 'X-Client-User-Agent': 'Transport_Operations_Software/1.0' }
        }
    );


    const data = res.data;
   

    if (data.addresstype == "road") {
        data.name = undefined;
    }

    const hit: GeocodeHit = {
        osm_id: data.place_id,
        osm_type: "node",
        osm_key: "place",
        osm_value: "address",
        country: data.address?.country,
        countrycode: data.address?.country_code,
        city: data.address?.city || data.address?.town || data.address?.village,
        quarter: data.address?.quarter,
        neighbourhood: data.address?.neighbourhood,
        suburb: data.address?.suburb,
        street: data.address?.road,
        housenumber: data.address?.house_number,
        name: data.name,
        postcode: data.address?.postcode,
        state: data.address?.region || data.address?.state,
        extent: undefined,
        point: new LatLng(parseFloat(data.lat), parseFloat(data.lon))
    };
    
    return hit;
};




const LocationMarker = ({ initialPosition, position, setPosition, selectedAddress, setSelectedAddress }: LocationMarkerProps) => {

    const map = useMapEvents({
        async click(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            const address =  await reverseGeocode(e.latlng);
            setSelectedAddress(getDisplayName(address));
            
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position);    
        }
    }, [position]);


    return position === null ? null : (
        <Marker position={position || initialPosition}>
            <Popup>{selectedAddress}</Popup>
        </Marker>
    )
}

export default LocationMarker