import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
    const [selectedParkingLot, setSelectedParkingLot] = useState('');
    const [startTime, setStartTime] = useState({ time: '12:00', period: 'AM'});
    const [endTime, setEndTime] = useState({ time: '12:00', period: 'AM'});
    const [reservation, setReservation] = useState(null);
    const [bookingName, setBookingName] = useState('');

    const value = {
        selectedParkingLot,
        setSelectedParkingLot,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        reservation,
        setReservation,
        bookingName,
        setBookingName
    };

    return (
        <ParkingContext.Provider value={value}>
            {children}
        </ParkingContext.Provider>
    );
}