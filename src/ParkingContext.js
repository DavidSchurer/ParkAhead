import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedParkingLot, setSelectedParkingLot] = useState('');
    const [bookingName, setBookingName] = useState('');

    return (
        <ParkingContext.Provider
            value={{
                reservations,
                setReservations,
                selectedSpot,
                setSelectedSpot,
                selectedCategory,
                setSelectedCategory,
                selectedParkingLot,
                setSelectedParkingLot,
                bookingName,
                setBookingName,
            }}
        >
            {children}
        </ParkingContext.Provider>
    );
};