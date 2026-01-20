import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card'
import VehicleImage from '../../../public/assets/images/mitsubishi-l300.png';
import { Form, usePage } from '@inertiajs/react';
import { Vehicle } from '@/types';
import { useNewReservation } from './context/new-reservation-context';
import { useForm } from '@inertiajs/react';
import ReservationController from '@/actions/App/Http/Controllers/ReservationController';

const VehicleCard = () => {
    const { props } = usePage<{ date: string, availableVehicles: Vehicle[], unavailableVehicles: Vehicle[] }>();

    const form = useForm();

    return (
        <div className=' grid grid-cols-1 xl:grid-cols-4 gap-3'>
            {props.availableVehicles.map((vehicle, index) => (
                <Form
                    key={index}
                    {...ReservationController.processStep1.form()}
                    options={{
                        preserveScroll: true,
                    }}  
                >
                    {({ submit, processing }) => (
                        
                        <Card
                            onClick={submit}   
                            className="cursor-pointer hover:shadow-lg"
                        >
                            <input type='hidden' name='vehicle_id' value={vehicle.vehicle_id} />
                            <input type='hidden' name='date' value={props.date} />
                            <CardHeader>
                                <figure>
                                    <img src={VehicleImage} alt={vehicle.model} />
                                </figure>
                            </CardHeader>
                            <CardContent>
                                <CardTitle>{vehicle.model}</CardTitle>
                                <CardDescription>
                                    <ul className="flex flex-col gap-2 text-xs mt-3">
                                        <li>Payload capacity up to 1,215 kg</li>
                                        <li>4,440 mm x 1,695 mm</li>
                                        <li>55 liters of fuel tank capacity</li>
                                    </ul>
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </Form>
            ))}


            {props.unavailableVehicles.map((vehicle, index) => (
                <Card className='opacity-50' key={index}>
                    <CardHeader>
                        <figure>
                            <img
                                src={VehicleImage}
                                alt="Mitsubishi L300" />
                        </figure>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className='flex items-center gap-2'>
                            <span>{vehicle.model}</span>
                            {/* <Badge variant="outline">RESERVED</Badge> */}
                        </CardTitle>
                        <CardDescription>
                            <ul className="flex flex-col gap-2 text-xs mt-3">
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>Payload capacity up to 1,215 kg</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>4,440 mm x 1,695 mm</span>
                                </li>
                                <li>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span>55 liters of fuel tank capacity </span>
                                </li>
                            </ul>
                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default VehicleCard