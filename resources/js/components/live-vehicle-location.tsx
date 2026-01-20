import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

type LatLngLike = { lat: number; lng: number };

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export default function LiveVehicleLocation({ vehicleLoc }: { vehicleLoc: LatLngLike }) {
    const map = useMap();
    const markerRef = useRef<L.Marker | null>(null);

    // displayedPos is what the marker shows; targetPos is filtered incoming pos
    const [displayedPos, setDisplayedPos] = useState<LatLngLike>(vehicleLoc);
    const targetRef = useRef<LatLngLike>(vehicleLoc);

    // Exponential smoothing factor for raw GPS -> target
    const ALPHA = 0.35; // 0.1 = heavy smoothing, 0.5 = light smoothing

    // Animation state
    const animRef = useRef<{ start: number; duration: number; from: LatLngLike; to: LatLngLike } | null>(null);

    // Update target with exponential smoothing when vehicleLoc changes
    useEffect(() => {
        if (!vehicleLoc) return;
        const prev = targetRef.current;
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
    }, [vehicleLoc]); // vehicleLoc is the raw incoming update

    // Ensure marker is created and synced on mount
    useEffect(() => {
        if (markerRef.current) markerRef.current.setLatLng([displayedPos.lat, displayedPos.lng]);
    }, []);

    // Optional: follow map center when a follow flag is set (not shown here)
    // map.panTo([displayedPos.lat, displayedPos.lng], { animate: true });

    return (
        <Marker
            position={[displayedPos.lat, displayedPos.lng]}
            ref={(m) => {
                // react-leaflet gives the leaflet marker instance here
                markerRef.current = (m as unknown) as L.Marker | null;
            }}
            //icon={L.icon({ iconUrl: "/marker-icon.png", iconAnchor: [12, 41] })}
        />
    );
}
