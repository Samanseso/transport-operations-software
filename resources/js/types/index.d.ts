import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import Reservations from '../pages/admin/reservations';


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
    roles: string[]
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

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: string;
    role_id: string;
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
    plate_number: string;
    model: string;
    capacity: string;
    created_at: string;
    updated_at: string;
}

import type { route as routeFn } from 'ziggy-js';
import { LatLng } from 'leaflet';

declare global {
    const route: typeof routeFn;
}

export interface InputReservation {
    vehicle_id: string;
    date: string;
    pickup_geocode: GeocodeHit;
    dropoff_geocode: GeocodeHit;
    customer_name: string;
    contact_number: string;
    requested_datetime: string;
    service_type: string;
    cargo_details: string;
    special_instructions: string;
}

export interface NewReservation {
    customer_name?: string;
    contact_number?: string;
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
    osm_id: number;              // OpenStreetMap ID of the feature
    osm_type: string;            // "node", "way", or "relation"
    osm_key: string;             // e.g. "place", "highway"
    osm_value: string;           // e.g. "city", "residential"
    country: string;             // Country name
    countrycode: string;         // ISO country code (e.g. "PH")
    state?: string;              // Optional state/region
    city?: string;               // Optional city
    quarter?: string;
    suburb?: string;
    neighbourhood?: string;
    street?: string;             // Optional street
    housenumber?: string;
    postcode?: string;           // Optional postal code
    name?: string;               // Display name of the location
    extent?: [number, number, number, number]; // Bounding box [minLon, minLat, maxLon, maxLat]
    point: LatLng;
}

export interface Reservation {
    reservation_id: string;
    customer_name: string;
    email: string;
    contact: string;
    status: string;
    pickup_address: string;
    pickup_latlng: string;
    dropoff_address: string;
    dropoff_latlng: string;
    date: string;
    time: string;
    service_type: string;
    cargo_details: string;
    special_instructions: string;
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
    driver_id: string;
    driver: Driver;
    plate_number: string;
    model: string;
    capacity: string;
    status: string;
    created_at: string;
    updated_at: string;
    driver: Driver;
}


export interface VehicleLocation {
    vehicle_id: string;
    lat: number;
    lng: number;
}