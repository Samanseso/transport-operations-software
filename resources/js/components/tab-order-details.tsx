import { Reservation } from '@/types';
import { MapPin, Navigation } from 'lucide-react';
import StatusTag from './status-tag';

const TabOrderDetails = ({ reservation }: { reservation: Reservation }) => {
    const waybillNo = reservation.waybill_number || `WB-${reservation.reservation_id.slice(0, 8).toUpperCase()}`;
    const startDate = reservation.dispatch?.schedule ? new Date(reservation.dispatch.schedule) : new Date(reservation.date);
    const endDate = new Date(reservation.date);

    return (
        <div className="h-28 space-y-2.5 px-4 py-3 text-slate-800 dark:text-slate-200">
            {/* Header: Waybill ID + Status Tag */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{waybillNo}</span>
                    <StatusTag text={reservation.status} />
                </div>

                <div className="text-right">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {reservation.service_type || 'General Freight'}
                    </span>
                </div>
            </div>

            {/* Route Timeline */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-1 text-xs dark:border-slate-800/80">
                <div className="flex items-start gap-2 truncate">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <div className="truncate">
                        <span className="block text-[10px] text-slate-500">Pick-up Origin</span>
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{reservation.pickup_address}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {reservation.time}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 truncate">
                    <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    <div className="truncate">
                        <span className="block text-[10px] text-slate-500">Dropoff Destination</span>
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{reservation.dropoff_address}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {reservation.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabOrderDetails;
