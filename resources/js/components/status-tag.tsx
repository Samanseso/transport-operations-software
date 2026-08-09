import React from 'react';
import { cn } from '@/lib/utils';

interface StatusTagProps {
    text: string;
    className?: string;
}

const formatStatusShort = (str: string) => {
    const norm = str ? str.toUpperCase().trim() : 'PENDING';
    switch (norm) {
        case 'DRIVER_EN_ROUTE_TO_PICKUP':
        case 'GOING TO PICKUP':
        case 'GOING_TO_PICKUP':
            return 'Going to Pickup';
        case 'ARRIVED_AT_PICKUP':
            return 'At Pickup';
        case 'CARGO_LOADED':
            return 'Cargo Loaded';
        case 'IN_TRANSIT':
        case 'EN ROUTE':
            return 'In Transit';
        case 'ARRIVED_AT_DROPOFF':
        case 'GOING TO DROPOFF':
            return 'At Dropoff';
        case 'PARTIAL_DELIVERY':
            return 'Partial Delivery';
        case 'FAILED_DROPOFF':
            return 'Failed Dropoff';
        case 'PENDING':
        case 'WAITING':
            return 'Pending';
        case 'ASSIGNED':
            return 'Assigned';
        case 'DELIVERED':
        case 'COMPLETE':
        case 'COMPLETED':
            return 'Delivered';
        default:
            return str.replace(/_/g, ' ');
    }
};

const StatusTag: React.FC<StatusTagProps> = ({ text, className }) => {
    const normalized = text ? text.toUpperCase() : 'PENDING';

    const getStatusStyle = () => {
        switch (normalized) {
            case 'PENDING':
            case 'WAITING':
                return 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30';
            case 'ASSIGNED':
                return 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/30';
            case 'DRIVER_EN_ROUTE_TO_PICKUP':
            case 'GOING TO PICKUP':
            case 'GOING_TO_PICKUP':
            case 'ARRIVED_AT_PICKUP':
                return 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/30';
            case 'CARGO_LOADED':
            case 'IN_TRANSIT':
            case 'EN ROUTE':
            case 'DISPATCHED':
                return 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/30';
            case 'ARRIVED_AT_DROPOFF':
            case 'GOING TO DROPOFF':
                return 'bg-purple-500/10 text-purple-700 ring-purple-500/20 dark:bg-purple-400/10 dark:text-purple-300 dark:ring-purple-400/30';
            case 'DELIVERED':
            case 'PAID':
            case 'COMPLETED':
                return 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30';
            case 'PARTIAL_DELIVERY':
                return 'bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/30';
            case 'FAILED_DROPOFF':
            case 'CANCELLED':
                return 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/30';
            default:
                return 'bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/30';
        }
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1 transition-all duration-200',
                getStatusStyle(),
                className,
            )}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
            {formatStatusShort(text)}
        </span>
    );
};

export default StatusTag;