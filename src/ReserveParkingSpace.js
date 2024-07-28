import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button, TextField } from '@mui/material';
import './ReserveParkingSpace.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';
import { auth, db } from './firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

function ReserveParkingSpace() {
    const { selectedTimeSlot, selectedDate, setSelectedDate, setSelectedTimeSlot, selectedOption, setSelectedOption, selectedParkingLot, setSelectedParkingLot, reservation, setReservations, bookingName, setBookingName, setReservationId } = useParkingContext();

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            } else {
                navigate('/Login');
            }
        };

        fetchUserEmail();
    }, [navigate]);

    useEffect(() => {
        if (!selectedDate) {
            const date = new Date();
            date.setHours(0,0,0,0);
            setSelectedDate(date);
        }
    }, [selectedDate, setSelectedDate]);

    useEffect(() => {
        if (bookingName && selectedParkingLot && selectedDate && selectedTimeSlot) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [bookingName, selectedParkingLot, selectedDate, selectedTimeSlot]);

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
        if (!isFormValid) {
            alert('Please fill out all required fields before proceeding.');
            return;
        }

        const [startTime, endTime] = selectedTimeSlot.split(' - ');
        const reservationDetails = {
            date: Timestamp.fromDate(selectedDate),
            parkingLot: selectedParkingLot,
            startTime,
            endTime,
            bookingName,
            userEmail
        };

        try {
            const docRef = await addDoc(collection(db, 'reservations'), reservationDetails);
            setReservationId(docRef.id);
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
                            required
                        />
                        <h4>2) Select UWB Parking Lot/Parking Garage:</h4>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                value={selectedParkingLot}
                                onChange={handleParkingLotChange}
                                required
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
                            required
                        />
                        <h4>4) Select Time Slot:</h4>
                        <FormControl fullWidth>
                            <Select
                                value={selectedTimeSlot}
                                onChange={handleTimeSlotChange}
                                displayEmpty
                                required
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
                        <div className="next-button-container">
                            <button className="next-button" onClick={handleNextClick}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="RightContainer">
                    <div className="Header">
                        <Avatar alt="User Avatar" src={require('./avatarImage.png')} />
                        <span className="Username">{userEmail}</span>
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