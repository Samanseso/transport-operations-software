import React from 'react';
import { Reservation } from '@/types';
import { FileCheck, Printer, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface TabDocumentsProps {
    reservation: Reservation;
}

const TabDocuments: React.FC<TabDocumentsProps> = ({ reservation }) => {
    const waybillNo = reservation.waybill_number || `WAYBILL-${reservation.reservation_id.slice(0, 8).toUpperCase()}`;
    const hasPod = Boolean(reservation.pod_signature_url || reservation.pod_photo_url || reservation.pod_signed_at);

    return (
        <div className="h-28 space-y-2.5 px-4 py-3 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <FileCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-mono text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100">{waybillNo}</p>
                        <p className="text-[11px] text-slate-500">Official Electronic Line-Haul Waybill</p>
                    </div>
                </div>

                <Link
                    href={`/reservations/${reservation.reservation_id}/waybill`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                    <Printer className="h-3.5 w-3.5" />
                    Print Waybill
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                    <span className="block text-[10px] text-slate-500">Proof of Delivery</span>
                    {hasPod ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Signed POD
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="h-3 w-3" /> Pending Delivery
                        </span>
                    )}
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Recipient Name</span>
                    <span className="text-xs font-medium truncate block">
                        {reservation.pod_recipient_name || reservation.waypoints?.[0]?.consignee_name || 'Designated Consignee'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Fare Total</span>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ₱{((reservation.total_fare_cents || 150000) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TabDocuments;
