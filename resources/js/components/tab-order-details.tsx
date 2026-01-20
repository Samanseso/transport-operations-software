import { Reservation } from "@/types"
import StatusTag from "./status-tag"


const TabOrderDetails = ({ reservation }: { reservation: Reservation }) => {
    return (
        <div>
            <div className='flex items-center'>
                <p className='w-17.5'>Status</p>
                <StatusTag text={reservation.dispatch.status} />
            </div>


            <div className="flex">
                <p className="w-18">Pickup</p>
                <p className="w-45 break-words">{reservation.pickup_address}</p>
            </div>

            <div className='flex'>
                <p className='w-18'>Dropoff</p>
                <p className='w-45 break-words'>{reservation.dropoff_address}</p>
            </div>

            <div className='flex'>
                <p className='w-18'>Schedule</p>
                <p className='w-45 break-words'>{reservation.date} {reservation.time}</p>
            </div>
        </div>
    )
}

export default TabOrderDetails