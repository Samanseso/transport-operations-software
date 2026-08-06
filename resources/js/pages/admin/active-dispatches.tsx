import ActiveDisptach from '@/components/active-dispatch'
import MapRoute from '@/components/map-route'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/app-layout'
import { index } from '@/routes/active-dispatches'
import { BreadcrumbItem, Reservation, SharedData } from '@/types'
import { usePage, router } from '@inertiajs/react'
import { ChevronDown, CornerDownRight, FlagTriangleRight, Gauge, MapPin, Pin, Route, SlidersHorizontal, Star, Timer } from 'lucide-react'
import { SidebarProvider } from '@/components/ui/sidebar'
import TabOrderDetails from '@/components/tab-order-details'
import { useState } from 'react'
import TabDriverInformation from '@/components/tab-driver-information'
import FloatingReservationDetails from '@/components/floating-reservation-details'
import { Input } from '@/components/ui/input'

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Active Dispatches',
		href: index().url,
	},
];

const ActiveDispatches = () => {
	const props = usePage<{ reservations: Reservation[], selectedReservation?: Reservation, filters?: { q?: string; status?: string }, statuses?: string[] }>().props;
	const isOpen = usePage<SharedData>().props.sidebarOpen;

	const selectedReservation = props.selectedReservation || props.reservations[0] || null;
	const [search, setSearch] = useState(props.filters?.q ?? '');

	const applyFilters = (event: React.FormEvent) => {
		event.preventDefault();
		router.get('/active-dispatches', {
			q: search || undefined,
		}, {
			preserveState: true,
			replace: true,
		});
	};

	const clearFilters = () => {
		setSearch('');
		router.get('/active-dispatches', {}, { replace: true });
	};







	return (
		<SidebarProvider defaultOpen={isOpen}>
			<AppLayout breadcrumbs={breadcrumbs} >
				<div className='flex flex-row'>
					<div className='flex-1 p-4 pt-4.5'>
						<p className='font-bold mb-4 text-sm'>Active disptaches</p>
						<form onSubmit={applyFilters} className='flex items-end gap-2 mb-3'>
							<div className='flex-1'>
								<Input
									type="text"
									placeholder="Search reservation, customer, driver"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
						</form>

						<div>
							{
								props.reservations.length > 0 ? 
								props.reservations.map((reservation) => (
									<ActiveDisptach key={reservation.reservation_id} reservation={reservation} selectedReservation={selectedReservation.reservation_id} />
								)):
								<div className='mt-5 text-gray-600'>
									No active reservations
								</div>
							}
						</div>
					</div>
					<div className='flex-3 relative rounded-s-md overflow-hidden bg-gray-200' style={{ height: "calc(100vh - 85px)", width: "100%" }}>

						{selectedReservation && <>
							<FloatingReservationDetails reservation={selectedReservation} />
							<MapRoute reservation={selectedReservation} padding={50} />
						</>}

					</div>
				</div>
			</AppLayout>
		</SidebarProvider>
	)
}

export default ActiveDispatches
