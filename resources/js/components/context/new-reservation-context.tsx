import { ModalType, InputReservation, Reservation, NewReservation } from '@/types';
import React, { createContext, useState, useContext, SetStateAction, useEffect } from 'react';

import { getDisplayName } from '@/lib/utils';
import axios from 'axios';


interface NewReservationContextProps {
    newReservation: InputReservation | null;
    setNewReservation: React.Dispatch<SetStateAction<InputReservation | null>>;
    getCurrentStep: () => number;
    reset: () => void;


}

const NewReservationContext = createContext<NewReservationContextProps | null>(null);


export const CreateReservationProvider = ({ children }: { children: React.ReactNode }) => {
    const [newReservation, setNewReservation] = useState<InputReservation | null>(() => {
        // Load from localStorage on first render
        const saved = localStorage.getItem('newReservation');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (newReservation) {
            localStorage.setItem('newReservation', JSON.stringify(newReservation));
        } else {
            localStorage.removeItem('newReservation');
        }
    }, [newReservation]);



    const getCurrentStep = (): number => {
        if (newReservation?.vehicle_id === null) return 0;
        if (newReservation?.pickup_geocode === null) return 1;
        if (newReservation?.dropoff_geocode === null) return 2;
        if (newReservation?.customer_name === null) return 3;

        return 4;
    }

    const reset = () => {
        setNewReservation(null);
    }

    const createReservation = () => {

       

        const reservation: NewReservation = {
            customer_name: newReservation?.customer_name,
            contact_number: newReservation?.contact_number,
            pickup_address: getDisplayName(newReservation?.pickup_geocode),
            pickup_latlng: `${newReservation?.pickup_geocode.point.lat},${newReservation?.pickup_geocode.point.lng}`,
            delivery_address: getDisplayName(newReservation?.dropoff_geocode),
            delivery_latlng: `${newReservation?.dropoff_geocode.point.lat},${newReservation?.dropoff_geocode.point.lng}`,
            requested_datetime: newReservation?.requested_datetime,
            service_type: newReservation?.service_type,
            cargo_details: newReservation?.cargo_details,
            special_instructions: newReservation?.special_instructions,
        }


    }

    return (
        <NewReservationContext.Provider value={{
            newReservation: newReservation,
            setNewReservation: setNewReservation,
            getCurrentStep: getCurrentStep,
            reset: reset,
        }}>
            {children}
        </NewReservationContext.Provider>
    );
};

export const useNewReservation = () => {
    const context = useContext(NewReservationContext);
    if (!context) throw new Error('useCreateReservation must be within Modal Provider');
    return context;
}