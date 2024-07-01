import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button, TextField } from '@mui/material';
import './ReserveParkingSpace.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';
import { db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

function ReserveParkingSpace() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const { selectedParkingLot, setSelectedParkingLot, reservation, setReservations, bookingName, setBookingName } = useParkingContext();

    const navigate = useNavigate();

    const handleParkingLotChange = (event) => {
        setSelectedParkingLot(event.target.value);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    const handleNextClick = async () => {
        const [startTime, endTime] = selectedTimeSlot.split(' - ');
        const reservationDetails = {
            date: Timestamp.fromDate(selectedDate),
            parkingLot: selectedParkingLot,
            startTime,
            endTime,
            bookingName,
            category: selectedOption
        };

        try {
            const docRef = await addDoc(collection(db, 'reservations'), reservationDetails);
            setReservations(prevReservations => [...prevReservations, { ...reservationDetails, id: docRef.id }]);
            navigate('/ParkingAvailability')
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleLogoutClick = () => {
        navigate('/Login');
    };

    const generateTimeSlots = () => {
        const timeSlots = [];
        let startTime = new Date();
        startTime.setHours(7, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(21, 0, 0, 0);

        while (startTime <= endTime) {
            const timeSlotStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeSlot = new Date(startTime);
            endTimeSlot.setHours(endTimeSlot.getHours() + 2);
            const timeSlotEnd = endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const timeSlotLabel = `${timeSlotStart} - ${timeSlotEnd}`;
            timeSlots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);

            startTime.setMinutes(startTime.getMinutes() + 30);
        }

        return timeSlots;
    };

    return (
        <>
            <div className="MainContainer">
                <div className="LeftContainer">
                    <div className="MainHeading">
                        <h1>Reserve Parking Space</h1>
                    </div>
                    <div className="Subheading">
                        <h2>Please fill in the following information:</h2>
                    </div>
                    <div className="ReservationDetails">
                        <h4>1) Enter Reservation Name:</h4>
                        <TextField
                            fullWidth
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            placeholder="Enter your reservation name"
                        />
                        <h4>2) Select UWB Parking Lot/Parking Garage:</h4>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                value={selectedParkingLot}
                                onChange={handleParkingLotChange}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Please Choose a Parking Garage/Lot:</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem disabled value="">
                                    <em>Please Choose a Parking Garage/Lot</em>
                                </MenuItem>
                                <MenuItem value={'South Garage'}>South Garage</MenuItem>
                                <MenuItem value={'North Garage'}>North Garage</MenuItem>
                                <MenuItem value={'West Garage'}>West Garage</MenuItem>
                                <MenuItem value={'Truly Lot'}>Truly Lot</MenuItem>
                            </Select>
                        </FormControl>
                        <h4>3) Select Date:</h4>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            inline
                        />
                        <h4>4) Select Time Slot:</h4>
                        <FormControl fullWidth>
                            <Select
                                value={selectedTimeSlot}
                                onChange={handleTimeSlotChange}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Please Choose a Time Slot</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem disabled>
                                    <em>Class Time Slots (Grace Period 15 Minutes Before and After Reservation Time)<br/></em>
                                </MenuItem>
                                <MenuItem value={'8:45 AM - 10:45 AM'}>8:45 AM - 10:45 AM</MenuItem>
                                <MenuItem value={'11:00 AM - 1:00 PM'}>11:00 AM - 1:00 PM</MenuItem>
                                <MenuItem value={'1:15 PM - 3:15 PM'}>1:15 PM - 3:15 PM</MenuItem>
                                <MenuItem value={'3:30 PM - 5:30 PM'}>3:30 PM - 5:30 PM</MenuItem>
                                <MenuItem value={'5:45 PM - 7:45 PM'}>5:45 PM - 7:45 PM</MenuItem>
                                <MenuItem value={'8:00 PM - 10:00 PM'}>8:00 PM - 10:00 PM</MenuItem>
                                <MenuItem disabled>
                                    <em>Standard Time Slots<br/></em>
                                </MenuItem>
                                {generateTimeSlots()}
                            </Select>
                        </FormControl>
                        <h4>5) Choose one of the following options:</h4>
                        <div className="selection-container">
                            <button
                                className={`selection-button ${selectedOption === 'Option 1' ? 'selected' : ''}`}
                                onClick={() => handleOptionChange('Option 1')}
                            >
                                I Have a UW Bothell Parking Permit
                            </button>
                            <button
                                className={`selection-button ${selectedOption === 'Option 2' ? 'selected' : ''}`}
                                onClick={() => handleOptionChange('Option 2')}
                            >
                                Purchase Parking Spot Reservation
                            </button>
                        </div>
                        <div className="next-button-container">
                            <button className="next-button" onClick={handleNextClick}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="RightContainer">
                    <div className="Header">
                        <Avatar alt="User Avatar" src={require('./avatarImage.png')} />
                        <span className="Username">dschurer</span>
                        <Button variant="outlined" className="LogoutButton" onClick={handleLogoutClick}>Log Out</Button>
                    </div>
                    <div className="box">
                        <div className="box-heading">Current Parking Spot Reservations</div>
                        <div className="placeholder-text">
                            {reservation ? (
                                <div>
                                    {reservation.date.toLocaleDateString()} {reservation.startTime} - {reservation.endTime} @ {reservation.parkingLot}
                                </div>
                            ) : (
                                "No reservations yet"
                            )}
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-heading">UW Bothell Parking Locations</div>
                        <MyGoogleMap />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReserveParkingSpace;
