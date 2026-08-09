import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: string[];
}

export interface SidebarNavItems {
    generalNavItems: NavItem[];
    modulesNavItems: NavItem[];
    footerNavItems: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationType<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface ModalType {
    open: boolean;
    status: string;
    action: string;
    title: string;
    message: string;
}

export interface PaginationLink {
    url: string;
    label: string;
    active: boolean;
}

export interface Vehicle {
    vehicle_id: string;
    driver_id: string;
    driver: Driver;
    plate_number: string;
    model: string;
    capacity: string;
    status: string;
    latitude?: number | string;
    longitude?: number | string;
    created_at: string;
    updated_at: string;
}

import { LatLng } from 'leaflet';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    interface Window {
        axios?: import('axios').AxiosInstance;
    }
}

export interface InputReservation {
    vehicle_id: string;
    date: string;
    pickup_geocode: GeocodeHit;
    dropoff_geocode: GeocodeHit;
    customer_id: string;
    requested_datetime: string;
    service_type: string;
    cargo_details: string;
    special_instructions: string;
}

export interface NewReservation {
    customer_id?: string;
    pickup_address?: string;
    pickup_latlng?: string;
    delivery_address?: string;
    delivery_latlng?: string;
    requested_datetime?: string;
    service_type?: string;
    cargo_details?: string;
    special_instructions?: string;
}

export interface GeocodeHit {
    osm_id: number; // OpenStreetMap ID of the feature
    osm_type: string; // "node", "way", or "relation"
    osm_key: string; // e.g. "place", "highway"
    osm_value: string; // e.g. "city", "residential"
    country: string; // Country name
    countrycode: string; // ISO country code (e.g. "PH")
    state?: string; // Optional state/region
    city?: string; // Optional city
    quarter?: string;
    suburb?: string;
    neighbourhood?: string;
    street?: string; // Optional street
    housenumber?: string;
    postcode?: string; // Optional postal code
    name?: string; // Display name of the location
    extent?: [number, number, number, number]; // Bounding box [minLon, minLat, maxLon, maxLat]
    point: LatLng;
}

export interface Reservation {
    reservation_id: string;
    waybill_number?: string | null;
    customer_id?: string;
    customer_name?: string;
    customer: User;
    status: string;
    pickup_address: string;
    pickup_latlng: string;
    dropoff_address: string;
    dropoff_latlng: string;
    waypoints?: any[];
    date: string;
    time: string;
    service_type: string;
    cargo_details: string;
    cargo_type?: string | null;
    cargo_weight_kg?: number;
    max_capacity_kg?: number;
    special_instructions: string;
    total_fare_cents?: number;
    base_rate_applied_cents?: number;
    per_km_rate_applied_cents?: number;
    per_min_rate_applied_cents?: number;
    pod_signature_url?: string | null;
    pod_photo_url?: string | null;
    pod_recipient_name?: string | null;
    pod_signed_at?: string | null;
    created_at: string;
    updated_at: string;
    dispatch: Dispatch;
}

export interface Dispatch {
    reservation_id: string;
    vehicle_id: string;
    status: string;
    schedule: string;
    assigned_at: string;
    delivered_at: string | null;
    vehicle: Vehicle;
}

export interface Driver {
    driver_id: string;
    name: string;
    contact_number: string;
    license_number: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    vehicle_id: string;
    driver_id: string | null;
    driver?: Driver | null;
    plate_number: string;
    vin_number?: string | null;
    model: string;
    capacity: string;
    registration_expires_at?: string | null;
    insurance_expires_at?: string | null;
    last_serviced_odometer?: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface VehicleLocation {
    vehicle_id: string;
    lat: number;
    lng: number;
}

export interface SystemLogEntry {
    datelog: string;
    timelog: string;
    action: string;
    module: string;
    performed_to: string;
    description: string;
}

export interface MaintenanceLog {
    maintenance_id: string;
    vehicle_id: string;
    vehicle?: Vehicle;
    service_type: string;
    odometer_reading: number;
    cost: number | string;
    service_center: string | null;
    status: string;
    scheduled_at: string | null;
    completed_at: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface FuelLog {
    fuel_log_id: string;
    vehicle_id: string;
    vehicle?: Vehicle;
    driver_id: string | null;
    driver?: Driver | null;
    liters: number | string;
    total_cost: number | string;
    odometer_reading: number;
    efficiency_km_l?: number | null;
    is_anomaly?: boolean;
    receipt_image_url?: string | null;
    filled_at: string;
    created_at: string;
    updated_at: string;
}

export interface Pricing {
    pricing_id: string;
    service_type: string;
    base_rate: string;
    distance_rate: string;
    travel_time_rate: string;
}

export interface Payment {
    reservation_id: string;
    reservation?: Reservation;
    distance: string;
    travel_time: string;
    total_amount: string;
    payment_method: string;
    reference_number: string;
    paid_at: string;
}

export interface VehicleInspection {
    inspection_id: string;
    vehicle_id: string;
    vehicle?: Vehicle;
    driver_id: string;
    driver?: Driver;
    tires_ok: boolean;
    brakes_ok: boolean;
    lights_ok: boolean;
    fuel_level: string;
    odometer_reading: number;
    defects_noted?: string | null;
    photo_url?: string | null;
    inspected_at: string;
    created_at: string;
    updated_at: string;
}

export interface DriverExpense {
    expense_id: string;
    driver_id: string;
    driver?: Driver;
    category: string;
    amount: number | string;
    description?: string | null;
    receipt_url?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

