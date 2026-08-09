import React from 'react';
import { Head } from '@inertiajs/react';
import { Reservation } from '@/types';
import StatusTag from '@/components/status-tag';
import { Printer, Truck, MapPin, Package, FileText, CheckCircle } from 'lucide-react';

interface Props {
    reservation: Reservation;
}

export default function WaybillPrint({ reservation }: Props) {
    const waybillCode = reservation.waybill_number || `WAYBILL-${reservation.reservation_id.slice(0, 6).toUpperCase()}`;
    const totalFareFormatted = '₱' + number_format((reservation.total_fare_cents || 150000) / 100, 2);

    function number_format(number: number, decimals: number) {
        return number.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    return (
        <div className="min-h-screen bg-slate-100 p-6 text-slate-900 print:bg-white print:p-0">
            <Head title={`Waybill ${waybillCode} - Official Document`} />

            {/* Print Toolbar (Hidden when printing) */}
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between print:hidden">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Commercial Waybill & Delivery Consignment</h1>
                    <p className="text-xs text-slate-500">Official consignment voucher for driver and receiving client sign-off.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                >
                    <Printer className="h-4 w-4" />
                    Print Waybill Document
                </button>
            </div>

            {/* Official Printable Waybill Sheet */}
            <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm print:rounded-none print:border-none print:shadow-none">
                {/* Header & Waybill Barcode Block */}
                <div className="flex items-start justify-between border-b pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-700">
                            <Truck className="h-7 w-7" />
                            <span className="text-xl font-black uppercase tracking-tight">Michael Archangel Trucking</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Single-Company Fleet & Logistics Operations</p>
                        <p className="text-xs text-slate-500">Metro Manila, Philippines · Hot Line: (02) 8888-LOGS</p>
                    </div>

                    <div className="text-right">
                        <div className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-white shadow-xs">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Waybill Tracking Code</p>
                            <p className="font-mono text-xl font-bold tracking-widest text-emerald-400">{waybillCode}</p>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                            Issue Date: <span className="font-semibold">{reservation.date}</span>
                        </p>
                    </div>
                </div>

                {/* Status & Service Summary */}
                <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-100">
                    <div>
                        <span className="text-slate-500 uppercase text-[10px]">Service Category</span>
                        <p className="font-bold text-slate-900">{reservation.service_type}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-500 uppercase text-[10px]">Status</span>
                        <div>
                            <StatusTag text={reservation.status} />
                        </div>
                    </div>
                </div>

                {/* Consignor & Consignee Details */}
                <div className="my-6 grid grid-cols-2 gap-6 border-b pb-6">
                    <div className="space-y-2 text-xs">
                        <p className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">Consignor / Account Tag</p>
                        <p className="text-sm font-bold text-slate-900">{reservation.customer?.name || 'Walk-in Client'}</p>
                        <p className="text-slate-600">{reservation.customer?.email || 'N/A'}</p>
                        <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase">Pick-Up Address</p>
                        <p className="font-semibold text-slate-800">{reservation.pickup_address}</p>
                    </div>

                    <div className="space-y-2 text-xs">
                        <p className="font-bold text-sky-700 uppercase tracking-wider text-[10px]">Consignee / Destination</p>
                        <p className="text-sm font-bold text-slate-900">{reservation.pod_recipient_name || reservation.customer?.name}</p>
                        <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase">Drop-Off Destination</p>
                        <p className="font-semibold text-slate-800">{reservation.dropoff_address}</p>
                    </div>
                </div>

                {/* Cargo Specifications & Transport Specs */}
                <div className="my-6 space-y-3">
                    <p className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                        <Package className="h-4 w-4 text-indigo-600" />
                        Cargo & Vehicle Payload Manifest
                    </p>
                    <table className="w-full text-left text-xs border">
                        <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px]">
                            <tr>
                                <th className="p-3 border">Cargo Type</th>
                                <th className="p-3 border">Estimated Weight</th>
                                <th className="p-3 border">Vehicle Assigned</th>
                                <th className="p-3 border">Driver Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-800">
                            <tr>
                                <td className="p-3 border font-semibold">{reservation.cargo_type || 'General Freight'}</td>
                                <td className="p-3 border font-mono">{reservation.cargo_weight_kg || 0} kg</td>
                                <td className="p-3 border font-mono">{reservation.dispatch?.vehicle?.plate_number || 'Unassigned'} ({reservation.dispatch?.vehicle?.model})</td>
                                <td className="p-3 border font-semibold">{reservation.dispatch?.vehicle?.driver?.name || 'Unassigned'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Financial Summary */}
                <div className="my-6 flex justify-end">
                    <div className="w-72 rounded-xl border p-4 text-xs space-y-2 bg-slate-50">
                        <div className="flex justify-between text-slate-600">
                            <span>Base Rate:</span>
                            <span className="font-mono">₱{number_format((reservation.base_rate_applied_cents || 150000) / 100, 2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Distance & Time Fare:</span>
                            <span className="font-mono">₱{number_format(((reservation.per_km_rate_applied_cents || 4500) * 15 + (reservation.per_min_rate_applied_cents || 1500) * 30) / 100, 2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                            <span>Total Fare:</span>
                            <span className="font-mono text-emerald-700">{totalFareFormatted}</span>
                        </div>
                    </div>
                </div>

                {/* Sign-off Blocks */}
                <div className="mt-12 grid grid-cols-2 gap-12 border-t pt-8">
                    <div className="text-center text-xs space-y-12">
                        <div className="border-b border-slate-400 pb-1">
                            <p className="font-semibold">{reservation.dispatch?.vehicle?.driver?.name || 'Dispatched Driver'}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase">Dispatched Driver Signature & Date</p>
                    </div>

                    <div className="text-center text-xs space-y-4">
                        {reservation.pod_signature_url ? (
                            <div className="h-16 flex items-center justify-center">
                                <img src={reservation.pod_signature_url} alt="Recipient Signature" className="max-h-14 object-contain mx-auto" />
                            </div>
                        ) : (
                            <div className="h-12 border-b border-slate-400"></div>
                        )}
                        <p className="font-semibold">{reservation.pod_recipient_name || 'Receiving Client / Consignee'}</p>
                        <p className="text-[10px] text-slate-500 uppercase">Proof of Delivery (POD) Signature & Date</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
