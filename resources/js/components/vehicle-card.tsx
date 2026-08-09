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
                                        <li>{vehicle.driver.name}</li>
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


            {props.unavailableVehicles.map((vehicle, index) => {
                const isUnsafe = vehicle.status === 'UNSAFE_FOR_DRIVE';
                const isMaintenance = vehicle.status === 'IN_MAINTENANCE' || vehicle.status === 'MAINTENANCE';

                return (
                    <Card className="relative overflow-hidden opacity-60 transition-opacity hover:opacity-75" key={index}>
                        <div className="absolute top-2 right-2 z-10">
                            {isUnsafe ? (
                                <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                                    ⚠️ SAFETY LOCKOUT (UNSAFE)
                                </span>
                            ) : isMaintenance ? (
                                <span className="rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                                    🛠️ IN MAINTENANCE
                                </span>
                            ) : (
                                <span className="rounded-md bg-slate-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                                    🔒 DISPATCHED / BOOKED
                                </span>
                            )}
                        </div>
                        <CardHeader>
                            <figure>
                                <img src={VehicleImage} alt={vehicle.model} />
                            </figure>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="flex items-center justify-between gap-2">
                                <span>{vehicle.model}</span>
                                <span className="font-mono text-xs font-semibold text-slate-500">#{vehicle.plate_number}</span>
                            </CardTitle>
                            <CardDescription>
                                <ul className="mt-3 flex flex-col gap-2 text-xs">
                                    <li className="font-medium text-slate-700 dark:text-slate-300">
                                        Driver: {vehicle.driver?.name || 'Unassigned'}
                                    </li>
                                    <li>Payload capacity up to 1,215 kg</li>
                                    <li>55 liters fuel capacity</li>
                                </ul>
                            </CardDescription>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default VehicleCard