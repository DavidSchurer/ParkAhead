import React, { createContext, useContext, useState } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => useContext(ParkingContext);

export const ParkingProvider = ({ children }) => {
    const [selectedParkingLot, setSelectedParkingLot] = useState('');

    const value = {
        selectedParkingLot,
        setSelectedParkingLot,
    };

    return (
        <ParkingContext.Provider value={value}>
            {children}
        </ParkingContext.Provider>
    );
}