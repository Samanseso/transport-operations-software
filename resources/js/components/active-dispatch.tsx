import { show } from '@/routes/active-dispatches';
import { Reservation } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { MapPin, Navigation } from 'lucide-react';
import StatusTag from './status-tag';

const ActiveDisptach = ({ reservation, selectedReservation, href }: { reservation: Reservation; selectedReservation: string; href?: string }) => {
    const { props } = usePage<{ filters?: { q?: string; status?: string } }>();

    const waybillNo = reservation.waybill_number || `WB-${reservation.reservation_id.slice(0, 8).toUpperCase()}`;
    const isSelected = selectedReservation === reservation.reservation_id;

    return (
        <Link
            as="div"
            className={`group mb-3 max-w-[320px] cursor-pointer rounded-2xl border p-4 shadow-xs transition-all duration-200 ${
                isSelected
                    ? 'border-l-4 border-slate-300 border-l-sky-500 bg-sky-50/80 shadow-sm dark:border-slate-700 dark:bg-sky-950/40'
                    : 'dark:hover:bg-slate-850 border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700'
            }`}
            href={href ?? show(reservation.reservation_id, { query: { q: props.filters?.q, status: props.filters?.status } })}
        >
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{waybillNo}</span>
                        <p className="max-w-[180px] truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {reservation.customer?.name || reservation.customer_name || 'Enterprise Client'}
                        </p>
                    </div>
                    <StatusTag text={reservation.status} />
                </div>

                <div className="space-y-1.5 border-t border-slate-100 pt-1 text-xs dark:border-slate-800/60">
                    <div className="flex items-center gap-1.5 truncate text-slate-700 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="truncate">{reservation.pickup_address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate text-slate-500 dark:text-slate-400">
                        <Navigation className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        <span className="truncate">{reservation.dropoff_address}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ActiveDisptach;
