import { Download, PencilLine, Plus, SlidersHorizontal, UserPlus } from "lucide-react"
import { Button } from "./ui/button"


const columns = [
	{ header: 'Vehicle', key: 'vehicle' },
	{ header: 'Status', key: 'status'},
	{ header: 'Customer Name', key: 'customer_name' },
	{ header: 'Pickup Location', key: 'pickup_address' },
	{ header: 'Dropoff Location', key: 'delivery_address' }]

export const ReservationsList = () => {
	return (
		<div className="h-full rounded-lg">
			<div className="border-b justify-between flex items-center p-3 rounded-t-lg mb-3">
				<p className="font-bold text-sm">Recent Reservations</p>
				<div className="flex gap-2.5">
					<Button variant="outline" size="sm" className="hidden md:flex text-xs"><SlidersHorizontal />Filter</Button>
					<Button variant="outline" size="sm" className="hidden md:flex text-xs"><UserPlus />Assign</Button>
					<Button variant="outline" size="sm" className="hidden md:flex text-xs"><PencilLine />Updated Status</Button>
					<Button variant="outline" size="sm" className="hidden md:flex text-xs"><Download />Export</Button>
					<Button variant="outline" size="sm" className="text-xs text-white bg-sky-500 hover:bg-sky-300 hover:text-white"><Plus />New Reservation</Button>
				</div>
			</div>
			
			
		</div>
	)
}
