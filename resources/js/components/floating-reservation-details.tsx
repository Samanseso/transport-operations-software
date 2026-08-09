import React, { useState } from 'react';
import { Reservation } from '@/types';
import TabOrderDetails from '@/components/tab-order-details';
import TabDriverInformation from '@/components/tab-driver-information';
import TabVehicleInformation from '@/components/tab-vehicle-information';
import TabCustomerInformation from '@/components/tab-customer-information';
import TabDocuments from '@/components/tab-documents';

const FloatingReservationDetails = ({ reservation }: { reservation: Reservation }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const vehicle = reservation.dispatch?.vehicle;
    const driver = vehicle?.driver;

    const tabs = [
        { text: 'Delivery Details', component: <TabOrderDetails reservation={reservation} /> },
        { text: 'Driver Information', component: <TabDriverInformation driver={driver || { driver_id: 'DRV-001', name: 'Assigned Driver', contact_number: '0917-000-0000', license_number: 'N01-12-345678', status: 'ACTIVE' }} /> },
        { text: 'Vehicle Specs', component: <TabVehicleInformation vehicle={vehicle} /> },
        { text: 'Customer Info', component: <TabCustomerInformation reservation={reservation} /> },
        { text: 'Waybill & Documents', component: <TabDocuments reservation={reservation} /> },
    ];

    return (
        <div className="absolute bottom-6 left-1/2 z-20 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/90 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 transition-all duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 pt-2 pb-0 dark:border-slate-800">
                {tabs.map((tab, index) => {
                    const isActive = index === tabIndex;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setTabIndex(index)}
                            className={`relative pb-2.5 text-xs font-semibold transition-colors duration-150 ${
                                isActive
                                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {tab.text}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)] dark:bg-sky-400" />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-1">{tabs[tabIndex].component}</div>
        </div>
    );
};

export default FloatingReservationDetails;