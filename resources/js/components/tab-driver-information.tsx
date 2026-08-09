import React from 'react';
import { Driver } from '@/types';
import { Button } from './ui/button';
import { Phone, MessageCircle, UserCheck, ShieldCheck } from 'lucide-react';
import StatusTag from './status-tag';

const TabDriverInformation = ({ driver }: { driver: Driver }) => {
    return (
        <div className="h-28 space-y-2.5 px-4 py-3 text-slate-800 dark:text-slate-200">
            {/* Header: Driver Name, Status & Quick Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-xs dark:bg-sky-950 dark:text-sky-300">
                            {driver.name ? driver.name.split(' ').map((n) => n[0]).join('') : 'DR'}
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{driver.name || 'Assigned Driver'}</p>
                            <StatusTag text={driver.status || 'ACTIVE'} />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Certified Heavy Line-Haul Driver</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a href={`tel:${driver.contact_number}`}>
                        <Button
                            size="sm"
                            type="button"
                            className="h-7 rounded-lg bg-sky-600 px-3 text-xs font-bold text-white hover:bg-sky-700 active:scale-[0.98] transition-all gap-1.5"
                        >
                            <Phone className="h-3 w-3" /> Call
                        </Button>
                    </a>
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        className="h-7 rounded-lg border-sky-300 text-sky-600 hover:bg-sky-50 active:scale-[0.98] transition-all gap-1.5 dark:border-sky-800 dark:text-sky-400"
                    >
                        <MessageCircle className="h-3 w-3" /> Chat
                    </Button>
                </div>
            </div>

            {/* Grid Specs */}
            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                    <span className="block text-[10px] text-slate-500">License Number</span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {driver.license_number || 'N01-12-345678'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Driver ID</span>
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                        {driver.driver_id || 'DRV-001'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Phone Contact</span>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {driver.contact_number || '0917-000-0000'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] text-slate-500">Insurance Policy</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        <ShieldCheck className="h-3 w-3" /> Verfied
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TabDriverInformation;