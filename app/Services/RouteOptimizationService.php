<?php

namespace App\Services;

class RouteOptimizationService
{
    /**
     * Sorts multi-stop dropoff waypoints into the optimal TSP sequence (Nearest Neighbor algorithm).
     *
     * @param string $pickupLatlng "lat,lng"
     * @param array $waypoints Array of waypoint objects
     * @return array Reordered optimal waypoints array
     */
    public static function optimizeWaypoints(string $pickupLatlng, array $waypoints): array
    {
        if (count($waypoints) <= 1) {
            return $waypoints;
        }

        $unvisited = $waypoints;
        $optimized = [];
        $currentLatlng = self::parseLatlng($pickupLatlng);

        while (! empty($unvisited)) {
            $nearestIndex = 0;
            $nearestDistance = INF;

            foreach ($unvisited as $index => $wp) {
                $wpLatlng = self::parseLatlng($wp['latlng'] ?? '14.6,121.0');
                $dist = self::haversineDistance($currentLatlng['lat'], $currentLatlng['lng'], $wpLatlng['lat'], $wpLatlng['lng']);

                if ($dist < $nearestDistance) {
                    $nearestDistance = $dist;
                    $nearestIndex = $index;
                }
            }

            $selected = $unvisited[$nearestIndex];
            $optimized[] = $selected;
            $currentLatlng = self::parseLatlng($selected['latlng'] ?? '14.6,121.0');
            array_splice($unvisited, $nearestIndex, 1);
        }

        return $optimized;
    }

    private static function parseLatlng(string $latlng): array
    {
        $parts = explode(',', $latlng);
        return [
            'lat' => (float) ($parts[0] ?? 14.5885),
            'lng' => (float) ($parts[1] ?? 120.9691),
        ];
    }

    private static function haversineDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371; // km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }
}
