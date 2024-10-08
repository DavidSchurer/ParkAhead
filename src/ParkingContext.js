import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedParkingLot, setSelectedParkingLot] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState(()=>{
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date
    });
    const [bookingName, setBookingName] = useState('');
    const [reservationId, setReservationId] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [headerEmail, setHeaderEmail] = useState('');
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
                selectedLevel,
                setSelectedLevel,
                headerEmail,
                setHeaderEmail
            }}
        >
            {children}
        </ParkingContext.Provider>
    );
};