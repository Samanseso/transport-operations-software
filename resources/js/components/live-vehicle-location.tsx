import React, { useEffect, useRef, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import TruckLogo from  '../../../public/assets/images/truck.png';

type LatLngLike = { lat: number; lng: number };

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// Create and memoize the icon using L.divIcon with Driver Truck badge
const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-truck-marker',
    html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="background-color: #0284C7; color: white; padding: 2px 6px; border-radius: 8px; font-weight: 700; font-size: 10px; font-family: system-ui, sans-serif; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 1.5px solid white; margin-bottom: 2px;">
                DRIVER TRUCK
            </div>
            <div style="width:54px; height:54px; display:flex; align-items:center; justify-content:center;">
                <img src="${TruckLogo}" alt="Driver Truck" style="width:54px; height:54px; object-fit:contain; filter:drop-shadow(0px 3px 6px rgba(0,0,0,0.4));" />
            </div>
        </div>
    `,
    iconSize: [80, 75],
    iconAnchor: [40, 75],
    popupAnchor: [0, -75],
});

export default function LiveVehicleLocation({ vehicleLoc }: { vehicleLoc: LatLngLike }) {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);

    // displayedPos is what the marker shows; targetRef is filtered incoming pos
    const [displayedPos, setDisplayedPos] = useState<LatLngLike>(vehicleLoc);
    const targetRef = useRef<LatLngLike>(vehicleLoc);
    const isFirstRef = useRef(true);

    // Exponential smoothing factor for raw GPS -> target
    const ALPHA = 0.35; // 0.1 = heavy smoothing, 0.5 = light smoothing

    // Animation state
    const animRef = useRef<{ start: number; duration: number; from: LatLngLike; to: LatLngLike } | null>(null);

    // Ensure marker instance is created with our icon on mount
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(vehicleIcon);
            markerRef.current.setLatLng([displayedPos.lat, displayedPos.lng]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update target: jump immediately on first load or large jump, animate smoothly for small updates
    useEffect(() => {
        if (!vehicleLoc) return;

        const prev = targetRef.current;
        const dist = Math.hypot(vehicleLoc.lat - prev.lat, vehicleLoc.lng - prev.lng);

        // Skip drift animation on first render or large position jumps (> 0.01 deg)
        if (isFirstRef.current || dist > 0.01) {
            isFirstRef.current = false;
            targetRef.current = vehicleLoc;
            setDisplayedPos(vehicleLoc);
            if (markerRef.current) {
                markerRef.current.setLatLng([vehicleLoc.lat, vehicleLoc.lng]);
            }
            return;
        }

        const smoothed = {
            lat: lerp(prev.lat, vehicleLoc.lat, ALPHA),
            lng: lerp(prev.lng, vehicleLoc.lng, ALPHA),
        };
        targetRef.current = smoothed;

        // start animation from current displayedPos to new smoothed target
        const from = displayedPos;
        const to = smoothed;
        const duration = 600; // ms, tune for smoothness
        animRef.current = { start: performance.now(), duration, from, to };

        // kick off RAF loop
        let raf = 0;
        const step = (ts: number) => {
            const anim = animRef.current;
            if (!anim) return;
            const t = Math.min(1, (ts - anim.start) / anim.duration);
            const next = { lat: lerp(anim.from.lat, anim.to.lat, t), lng: lerp(anim.from.lng, anim.to.lng, t) };
            setDisplayedPos(next);
            // update marker directly for lower latency
            if (markerRef.current) markerRef.current.setLatLng([next.lat, next.lng]);
            if (t < 1) raf = requestAnimationFrame(step);
            else animRef.current = null;
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleLoc.lat, vehicleLoc.lng]);


    return (
        <Marker
            position={[displayedPos.lat, displayedPos.lng]}
            icon={vehicleIcon}
            ref={(m) => {
                // react-leaflet's Marker ref can be cast to Leaflet Marker instance
                markerRef.current = (m as unknown) as L.Marker | null;
                // ensure icon is set if the instance becomes available later
                if (markerRef.current) markerRef.current.setIcon(vehicleIcon);
            }}
        />
    );
}
