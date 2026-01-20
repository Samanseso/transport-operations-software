import { GeocodeHit } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import L from 'leaflet';
import { LatLng } from 'leaflet';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getDisplayName = (address: GeocodeHit | null | undefined, fallback?: string): string => {
    if (!address) {
        return "Unknown address";
    }

    const parts = [
        address.name,
        address.housenumber,
        address.street,
        address.neighbourhood,
        address.suburb,
        address.quarter,
        address.city,
        address.state,
        address.country,
        address.postcode
    ].filter(Boolean);


    if (parts.length > 0) {
        return parts.join(", ");
    }



    return fallback || "Unknown address";
};


export const latlngToString = (point: LatLng): string => {
    return `${point.lat},${point.lng}`;
}

const API_KEY = "0ff16599-5a92-4b5a-8bed-d051d277d043";



export async function getRoutes(
    driver: LatLng,
    stops: LatLng[],
    options?: { vehicle?: string; locale?: string }
): Promise<LatLng[]> {
    const vehicle = options?.vehicle ?? "car";
    const locale = options?.locale ?? "en";

    // Build points: driver first, then stops in order
    const allPoints = [driver, ...stops];
    const pointsQuery = allPoints.map(p => `point=${p.lat},${p.lng}`).join("&");

    // GraphHopper query: points_encoded=false returns coordinates array [lon,lat]
    const url = `https://graphhopper.com/api/1/route?${pointsQuery}&vehicle=${vehicle}&locale=${locale}&points_encoded=false&instructions=true&key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Routing error ${res.status}: ${text}`);
    }

    const data = await res.json();

    // paths[0].points.coordinates is [lon, lat] pairs when points_encoded=false
    const coords: LatLng[] =
        data.paths?.[0]?.points?.coordinates?.map((c: number[]) => ({ lat: c[1], lng: c[0] })) ?? [];

    return coords;
}


// Helper: returns projection info or null
export function findClosestProjectionOnPolyline(
  map: L.Map,
  polylinePoints: LatLng[],
  driverLatLng: L.LatLng
): { projectedLatLng: L.LatLng; segmentIndex: number; distanceMeters: number } | null {
  if (!polylinePoints || polylinePoints.length < 2) return null;

  const driverPoint = map.latLngToLayerPoint(driverLatLng);

  let bestDist = Infinity;
  let bestProjectedPoint: L.Point | null = null;
  let bestIdx = 0;

  for (let i = 0; i < polylinePoints.length - 1; i++) {
    const aLatLng = L.latLng(polylinePoints[i]);
    const bLatLng = L.latLng(polylinePoints[i + 1]);

    const aPoint = map.latLngToLayerPoint(aLatLng);
    const bPoint = map.latLngToLayerPoint(bLatLng);

    const projPoint = L.LineUtil.closestPointOnSegment(driverPoint, aPoint, bPoint);
    const dist = driverPoint.distanceTo(projPoint);

    if (dist < bestDist) {
      bestDist = dist;
      bestProjectedPoint = projPoint;
      bestIdx = i;
    }
  }

  if (!bestProjectedPoint) return null;

  const projectedLatLng = map.layerPointToLatLng(bestProjectedPoint);
  const distanceMeters = driverLatLng.distanceTo(projectedLatLng);

  return { projectedLatLng, segmentIndex: bestIdx, distanceMeters };
}
