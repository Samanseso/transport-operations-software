import { getDisplayName } from '@/lib/utils';
import axios from 'axios';
import { LatLng } from 'leaflet';
import { SetStateAction, useEffect, useRef } from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { GeocodeHit } from '../types/index';

interface LocationMarkerProps {
    initialPosition: LatLng;
    position: LatLng;
    setPosition: React.Dispatch<SetStateAction<LatLng>>;
    selectedAddress: string | null;
    setSelectedAddress: React.Dispatch<SetStateAction<string | null>>;
    onLoading?: (loading: boolean) => void;
}

const reverseGeocode = async (position: LatLng): Promise<GeocodeHit> => {
    const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`,
        {
            headers: { 'X-Client-User-Agent': 'Transport_Operations_Software/1.0' },
        },
    );

    const data = res.data;

    if (data.addresstype == 'road') {
        data.name = undefined;
    }

    const hit: GeocodeHit = {
        osm_id: data.place_id,
        osm_type: 'node',
        osm_key: 'place',
        osm_value: 'address',
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
        point: new LatLng(parseFloat(data.lat), parseFloat(data.lon)),
    };

    return hit;
};

const LocationMarker = ({ initialPosition, position, setPosition, selectedAddress, setSelectedAddress, onLoading }: LocationMarkerProps) => {
    // Use refs for all callbacks so the useMapEvents handler always uses the latest versions
    const setPositionRef = useRef(setPosition);
    const setSelectedAddressRef = useRef(setSelectedAddress);
    const onLoadingRef = useRef(onLoading);

    useEffect(() => {
        setPositionRef.current = setPosition;
    }, [setPosition]);
    useEffect(() => {
        setSelectedAddressRef.current = setSelectedAddress;
    }, [setSelectedAddress]);
    useEffect(() => {
        onLoadingRef.current = onLoading;
    }, [onLoading]);

    // Track last position by value to avoid unnecessary flyTo calls
    const lastFlyToRef = useRef<{ lat: number; lng: number } | null>(null);
    // Flag to skip flyTo when position change came from a map click (we already flyTo in the handler)
    const skipNextFlyRef = useRef(false);

    const map = useMap();

    useMapEvents({
        async click(e) {
            skipNextFlyRef.current = true;
            setPositionRef.current(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            lastFlyToRef.current = { lat: e.latlng.lat, lng: e.latlng.lng };

            onLoadingRef.current?.(true);
            try {
                const address = await reverseGeocode(e.latlng);
                setSelectedAddressRef.current(getDisplayName(address));
            } catch (err) {
                console.error('Reverse geocoding failed:', err);
            } finally {
                onLoadingRef.current?.(false);
            }
        },
    });

    // Only flyTo when position changes from the AddressComboBox (external source), not from map clicks
    useEffect(() => {
        if (!position) return;

        if (skipNextFlyRef.current) {
            skipNextFlyRef.current = false;
            return;
        }

        const posLat = position.lat;
        const posLng = position.lng;

        // Skip if we already flew to this position
        if (lastFlyToRef.current && Math.abs(lastFlyToRef.current.lat - posLat) < 0.000001 && Math.abs(lastFlyToRef.current.lng - posLng) < 0.000001) {
            return;
        }

        lastFlyToRef.current = { lat: posLat, lng: posLng };
        map.flyTo(position);
    }, [position.lat, position.lng, map]);

    return position === null ? null : (
        <Marker position={position || initialPosition}>
            <Popup>{selectedAddress}</Popup>
        </Marker>
    );
};

export default LocationMarker;