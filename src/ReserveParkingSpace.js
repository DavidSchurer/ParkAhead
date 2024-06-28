import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button, TextField } from '@mui/material';
import './ReserveParkingSpace.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';

function ReserveParkingSpace() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const { selectedParkingLot, setSelectedParkingLot, reservation, setReservation, bookingName, setBookingName } = useParkingContext();

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

    const handleNextClick = () => {
        const reservationDetails = {
            date: selectedDate,
            parkingLot: selectedParkingLot,
            timeSlot: selectedTimeSlot,
            bookingName
        };
        setReservation(reservationDetails);
        navigate('/ParkingAvailability');
    };

    const handleLogoutClick = () => {
        navigate('/Login');
    };

    // Function to generate time slots from 7:00am to 11:00pm in 30-minute increments
    const generateTimeSlots = () => {
        const timeSlots = [];
        let startTime = new Date();
        startTime.setHours(7, 0, 0, 0); // First available 2-hour time slot at 7:00am

        const endTime = new Date();
        endTime.setHours(21, 0, 0, 0); // Final available 2-hour time slot at 9:00pm

        while (startTime <= endTime) {
            const timeSlotStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeSlot = new Date(startTime);
            endTimeSlot.setHours(endTimeSlot.getHours() + 2); // Increment by 2 hours
            const timeSlotEnd = endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const timeSlotLabel = `${timeSlotStart} - ${timeSlotEnd}`;
            timeSlots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);

            startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
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
                                    if (selected.length === 0) {
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
                                    if (selected.length === 0) {
                                        return <em>Please Choose a Time Slot</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem disabled>
                                    <em>Class Time Slots (Grace Period 15 Minutes Before and After Reservation Time)<br/>
                                    </em>
                                </MenuItem>
                                <MenuItem value={'8:45am - 10:45am'}>8:45am - 10:45am</MenuItem>
                                <MenuItem value={'11:00am - 1:00pm'}>11:00am - 1:00pm</MenuItem>
                                <MenuItem value={'1:15pm - 3:15pm'}>1:15pm - 3:15pm</MenuItem>
                                <MenuItem value={'3:30pm - 5:30pm'}>3:30pm - 5:30pm</MenuItem>
                                <MenuItem value={'5:45pm - 7:45pm'}>5:45pm - 7:45pm</MenuItem>
                                <MenuItem value={'8:00pm - 10:00pm'}>8:00pm - 10:00pm</MenuItem>
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
                                    {reservation.date.toLocaleDateString()} {reservation.timeSlot} @ {reservation.parkingLot}
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
