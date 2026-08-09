import React from 'react';
import { Vehicle } from '@/types';
import { Truck, ShieldCheck, Weight, Gauge } from 'lucide-react';
import StatusTag from './status-tag';

interface TabVehicleInformationProps {
    vehicle?: Vehicle | null;
}

const TabVehicleInformation: React.FC<TabVehicleInformationProps> = ({ vehicle }) => {
    if (!vehicle) {
        return (
            <div className="flex h-28 items-center justify-center p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                <p>No vehicle assigned to this dispatch yet.</p>
            </div>
        );
    }

    return (
        <div className="h-28 space-y-2.5 px-4 py-3 text-slate-800 dark:text-slate-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                        <Truck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold">{vehicle.model || 'Standard Line-Haul Truck'}</p>
                        <p className="font-mono text-[11px] font-bold tracking-tight text-slate-500 dark:text-slate-400">
                            {vehicle.plate_number || 'N/A'}
                        </p>
                    </div>
                </div>
                <StatusTag text={vehicle.status || 'AVAILABLE'} />
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                    <span className="block text-[10px] text-slate-500">Payload Capacity</span>
                    <span className="font-mono text-xs font-bold">{vehicle.capacity || '1,500 kg'}</span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Vehicle ID</span>
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                        {vehicle.vehicle_id ? vehicle.vehicle_id.slice(0, 8) : 'VEH-01'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Driver Assigned</span>
                    <span className="text-xs font-medium truncate block">
                        {vehicle.driver?.name || 'Assigned Driver'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Telematics GPS</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> Active
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TabVehicleInformation;
