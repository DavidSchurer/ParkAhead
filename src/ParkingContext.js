import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedParkingLot, setSelectedParkingLot] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingName, setBookingName] = useState('');
    const [reservationId, setReservationId] = useState(null);

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
                selectedTimeSlot,
                setSelectedTimeSlot,
                selectedDate,
                setSelectedDate,
                bookingName,
                setBookingName,
                reservationId,
                setReservationId,
            }}
        >
            {children}
        </ParkingContext.Provider>
    );
};