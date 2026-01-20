import { Reservation } from '@/types'
import StatusTag from './status-tag'
import { Separator } from './ui/separator';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/active-dispatches';
import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';



const ActiveDisptach = ({ reservation, selectedReservation }: { reservation: Reservation, selectedReservation: string }) => {

	const startDate = new Date(reservation.dispatch.schedule);
	const endDate = new Date(reservation.date);

	const startLoc = reservation.pickup_address.split(',')[0] + ", " + reservation.pickup_address.split(",").at(-4) + " ";
	const endLoc = reservation.dropoff_address.split(',')[0] + ", " + reservation.dropoff_address.split(",").at(-4);

	

	return (
		<Link as="div" className={'bg-gray-100 rounded-sm mb-2 py-3 cursor-pointer ' + `${selectedReservation === reservation.reservation_id ? 'border-s-3 border-blue-400 bg-sky-50' : ''}`} href={show(reservation.reservation_id)}>
			<div className="px-3">
				<div className='flex justify-between items-center mb-1'>
					<p className='text-sm'>ID <span className='id-code-font'>{
						reservation.reservation_id.split('-')[0] + "-" +
						reservation.reservation_id.split('-')[1] +
						"..."
					}</span>
					</p>
					<StatusTag text={reservation.dispatch.status} />
				</div>


				<p className='text-xs text-gray-500 mb-2'>{reservation.service_type}</p>




				<div className='flex flex-row gap-2'>
					<div className='w-8 flex flex-col gap-2'>
						<p className='text-xs text-gray-500 text-nowrap'>{startDate.toLocaleString('default', { month: 'short' })} {startDate.getDate()}</p>
						<p className='text-xs text-gray-500 text-nowrap'>{endDate.toLocaleString('default', { month: 'short' })} {endDate.getDate()}</p>
					</div>
					<div className="timeline">	
						<div className="dot"></div>
						<div className="line"></div>
						<div className="dot"></div>
					</div>

					<div className='flex flex-col gap-2 w-60'>
						<p className='text-xs truncate'>{startLoc}</p>
						<p className='text-xs truncate'>{endLoc}</p>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default ActiveDisptach