import React from 'react';
import { Reservation } from '@/types';
import { User, Mail, FileText, Package } from 'lucide-react';

interface TabCustomerInformationProps {
    reservation: Reservation;
}

const TabCustomerInformation: React.FC<TabCustomerInformationProps> = ({ reservation }) => {
    const customer = reservation.customer;

    return (
        <div className="h-28 space-y-2.5 px-4 py-3 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <User className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold">{customer?.name || reservation.customer_name || 'Valued Enterprise Client'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {customer?.email || 'client@logistics.com'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-slate-500">Customer ID</span>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        USR-{customer?.id || reservation.customer_id || '001'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start gap-1.5">
                    <Package className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                        <span className="block text-[10px] text-slate-500">Cargo Details</span>
                        <p className="text-xs font-medium truncate max-w-[200px]">
                            {reservation.cargo_details || 'Standard Freight Goods'}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                        <span className="block text-[10px] text-slate-500">Special Instructions</span>
                        <p className="text-xs font-medium truncate max-w-[200px]">
                            {reservation.special_instructions || 'Standard Gate Access Protocol'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabCustomerInformation;
