import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BreadcrumbItem, Pricing, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { DollarSign, Calculator, Plus, Edit2, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Pricing Rate Cards',
        href: '/settings/pricing',
    },
];

interface Props {
    pricings: Pricing[];
    [key: string]: unknown;
}

export default function PricingSettings() {
    const props = usePage<Props>().props;
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [serviceType, setServiceType] = useState('Standard Freight Transport');
    const [baseRate, setBaseRate] = useState('1500');
    const [distanceRate, setDistanceRate] = useState('45');
    const [travelTimeRate, setTravelTimeRate] = useState('15');

    // Simulator State
    const [simDistance, setSimDistance] = useState('25');
    const [simTime, setSimTime] = useState('45');
    const [simService, setSimService] = useState('');

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        router.post(
            '/settings/pricing',
            {
                service_type: serviceType,
                base_rate: baseRate,
                distance_rate: distanceRate,
                travel_time_rate: travelTimeRate,
            },
            {
                onSuccess: () => {
                    setIsCreateOpen(false);
                },
            }
        );
    };

    const calculatedFare = () => {
        const pricing = props.pricings.find((p) => p.service_type === simService) || props.pricings[0];
        if (!pricing) return 0;
        const base = parseFloat(pricing.base_rate) || 0;
        const dist = parseFloat(pricing.distance_rate) * (parseFloat(simDistance) || 0);
        const time = parseFloat(pricing.travel_time_rate) * (parseFloat(simTime) || 0);
        return base + dist + time;
    };

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <AppLayout breadcrumbs={breadcrumbs}>
                <SettingsLayout>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Dynamic Rate Cards & Fare Rules Engine
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Configure base rates, distance rates per kilometer, and travel time charges per service tier.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="gap-2 bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                Add Rate Card
                            </Button>
                        </div>

                        {/* Rate Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {props.pricings.length === 0 ? (
                                <div className="col-span-3 rounded-lg border p-6 text-center text-xs text-slate-400">
                                    No custom rate cards defined. Add a service rate card to enable automatic distance pricing.
                                </div>
                            ) : (
                                props.pricings.map((card) => (
                                    <div
                                        key={card.pricing_id}
                                        className="relative rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                                <Tag className="h-3 w-3" />
                                                {card.service_type}
                                            </span>
                                        </div>
                                        <div className="mt-4 space-y-2 border-t pt-3 text-xs dark:border-slate-800">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Base Pickup Fee:</span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    ₱{Number(card.base_rate).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Distance Rate (per km):</span>
                                                <span className="font-bold text-emerald-600">
                                                    ₱{Number(card.distance_rate).toFixed(2)} / km
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Travel Time Rate:</span>
                                                <span className="font-bold text-amber-600">
                                                    ₱{Number(card.travel_time_rate).toFixed(2)} / min
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Interactive Pricing Simulator */}
                        <div className="rounded-xl border bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-md">
                            <div className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-sky-400" />
                                <h3 className="text-sm font-bold">Fare Price Calculator Simulator</h3>
                            </div>
                            <p className="mt-1 text-xs text-slate-300">
                                Test fare output calculation based on distance formula: Base + (KM × Rate) + (Min × Rate).
                            </p>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="block text-[11px] text-slate-400">Service Type</label>
                                    <select
                                        value={simService}
                                        onChange={(e) => setSimService(e.target.value)}
                                        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-xs text-white"
                                    >
                                        {props.pricings.map((p) => (
                                            <option key={p.pricing_id} value={p.service_type}>
                                                {p.service_type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400">Estimated Distance (km)</label>
                                    <Input
                                        type="number"
                                        value={simDistance}
                                        onChange={(e) => setSimDistance(e.target.value)}
                                        className="mt-1 border-slate-700 bg-slate-800 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400">Est. Travel Time (mins)</label>
                                    <Input
                                        type="number"
                                        value={simTime}
                                        onChange={(e) => setSimTime(e.target.value)}
                                        className="mt-1 border-slate-700 bg-slate-800 text-white"
                                    />
                                </div>
                                <div className="flex flex-col justify-end rounded-lg bg-sky-950/60 p-3 border border-sky-800">
                                    <span className="text-[10px] uppercase tracking-wider text-sky-300">Calculated Total Fare</span>
                                    <span className="text-xl font-black text-sky-400">
                                        ₱{calculatedFare().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal to add rate card */}
                        {isCreateOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Rate Card</h3>
                                    <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Service Tier Name</label>
                                            <Input
                                                required
                                                value={serviceType}
                                                onChange={(e) => setServiceType(e.target.value)}
                                                placeholder="e.g. Heavy Duty Refrigerated Trucking"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Base Pickup Fee (₱)</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={baseRate}
                                                onChange={(e) => setBaseRate(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Distance Rate per KM (₱)</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={distanceRate}
                                                onChange={(e) => setDistanceRate(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-medium text-slate-700 dark:text-slate-300">Travel Time Rate per Min (₱)</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={travelTimeRate}
                                                onChange={(e) => setTravelTimeRate(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                                                Save Rate Card
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </SettingsLayout>
            </AppLayout>
        </SidebarProvider>
    );
}
