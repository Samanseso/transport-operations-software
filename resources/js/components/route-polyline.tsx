import { Polyline, useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useRef, useEffect, useState } from 'react';
import { findClosestProjectionOnPolyline } from '@/lib/utils';

interface RoutePolylineProps {
    routePoints: LatLng[];      // full route polyline points
    driverPos: LatLng | null;   // current driver position
    trimDebounceMs?: number;        // optional debounce for trimming
    setBounds: (map: L.Map, bounds: L.LatLngBounds) => void;
}

export default function RoutePolyline({ routePoints, driverPos, trimDebounceMs = 100, setBounds }: RoutePolylineProps) {
    const map = useMap(); // get typed map instance
    const polyRef = useRef<L.Polyline | null>(null);
    const [remaining, setRemaining] = useState<LatLng[]>(routePoints);

    // keep remaining in sync when routePoints change (new route)
    useEffect(() => {
        map.zoomControl.setPosition("topright");
        setRemaining(routePoints);
        const bounds = L.latLngBounds(routePoints);
        setBounds(map, bounds);
    }, [routePoints]);

    // inside your component
    useEffect(() => {
        if (!driverPos) return;
        if (!remaining || remaining.length < 2) return;

        let mounted = true;
        const timer = setTimeout(() => {
            if (!mounted) return;

            try {
                const driverLatLng = L.latLng(driverPos); // ensure L.LatLng
                const result = findClosestProjectionOnPolyline(map, remaining, driverLatLng);

                // explicit null check (avoids "void" truthiness error)
                if (result === null) return;

                const { projectedLatLng, segmentIndex, distanceMeters } = result;

                const TRIM_THRESHOLD_METERS = 5;
                if (distanceMeters <= TRIM_THRESHOLD_METERS) {
                    // remaining is typed as L.LatLngExpression[]
                    const nextPoints = remaining.slice(segmentIndex + 1); // still LatLngExpression[]

                    // convert nextPoints[0] to L.LatLng before comparing
                    const firstNextLatLng = nextPoints.length ? L.latLng(nextPoints[0]) : null;

                    // build newRemaining as L.LatLng[] so equals() exists
                    const newRemaining: L.LatLng[] = [projectedLatLng, ...nextPoints.map(p => L.latLng(p))];

                    // remove duplicate if projected equals the next vertex
                    if (firstNextLatLng && projectedLatLng.equals(firstNextLatLng)) {
                        newRemaining.shift();
                    }

                    // fallback to last point if empty
                    if (newRemaining.length === 0 && remaining.length > 0) {
                        newRemaining.push(L.latLng(remaining[remaining.length - 1]));
                    }

                    setRemaining(newRemaining as unknown as LatLng[]); 
                } else {
                    // skip trimming if too far
                }
            } catch (err) {
                console.error("Route trimming error:", err);
            }
        }, trimDebounceMs);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [driverPos, remaining, map, trimDebounceMs]);


    // update the actual Leaflet polyline in place for smooth redraws
    useEffect(() => {
        if (polyRef.current) {
            // setLatLngs exists on L.Polyline
            polyRef.current.setLatLngs(remaining as L.LatLngExpression[]);
        }
    }, [remaining]);

    return (
        <Polyline
            positions={remaining}
            ref={(el) => {
                // react-leaflet v3/v4 gives the underlying leaflet instance here
                polyRef.current = (el as unknown) as L.Polyline | null;
            }}
            pathOptions={{ color: '#5ba3f1', weight: 5 }}
        />

        
    );
}

