import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, TextField } from '@mui/material';
import './ReserveParkingSpace.css';
import uwbMap from './uwbmap.png';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';
import { auth, db } from './firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

function ReserveParkingSpace() {
    const { selectedTimeSlot, selectedDate, setSelectedDate, setSelectedTimeSlot, selectedOption, setSelectedOption, selectedParkingLot, setSelectedParkingLot, reservation, setReservations, bookingName, setBookingName, setReservationId } = useParkingContext();

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [duration, setDuration] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [isAllDay, setIsAllDay] = useState(false);

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
            date.setHours(0, 0, 0, 0);
            setSelectedDate(date);
        }
    }, [selectedDate, setSelectedDate]);

    useEffect(() => {
        if (bookingName && selectedParkingLot && selectedDate && (isAllDay || selectedTimeSlot)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [bookingName, selectedParkingLot, selectedDate, selectedTimeSlot, isAllDay]);

    useEffect(() => {
        if (isAllDay) {
            setTimeSlots(generateAllDay());
        } else {
            setTimeSlots(generateTimeSlots());
        }
    }, [duration, isAllDay]);

    const handleParkingLotChange = (event) => {
        setSelectedParkingLot(event.target.value);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setDuration(selectedDuration);
        setIsAllDay(selectedDuration === 'All Day');
    };

    const handleNextClick = async () => {
        if (!isFormValid) {
            alert('Please fill out all required fields before proceeding.');
            return;
        }

        const [startTime, endTime] = selectedTimeSlot ? selectedTimeSlot.split(' - ') : [null, null];
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
            navigate('/ParkingAvailability');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleLogoutClick = () => {
        navigate('/Login');
    };

    const generateTimeSlots = () => {
        const slots = [];
        let startTime = new Date();
        startTime.setHours(7, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(23, 0, 0, 0);

        if (duration === '2 Hours') {
            while (startTime < endTime) {
                const timeSlotStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTimeSlot = new Date(startTime);
                endTimeSlot.setHours(endTimeSlot.getHours() + 2);
                const timeSlotEnd = endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                if (endTimeSlot > endTime) {
                    break;
                }

                const timeSlotLabel = `${timeSlotStart} - ${timeSlotEnd}`;
                slots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);

                startTime.setMinutes(startTime.getMinutes() + 30);
            }
        } else if (duration === '4 Hours') {
            while (startTime < endTime) {
                const timeSlotStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTimeSlot = new Date(startTime);
                endTimeSlot.setHours(endTimeSlot.getHours() + 4);
                const timeSlotEnd = endTimeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                if (endTimeSlot > endTime) {
                    break;
                }

                const timeSlotLabel = `${timeSlotStart} - ${timeSlotEnd}`;
                slots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);

                startTime.setMinutes(startTime.getMinutes() + 30);
            }
        }

        return slots;
    };

    const generateAllDay = () => {
        const slots = [];
        const today = new Date();
        let startTime;
        let endTime;

        if (selectedDate.toDateString() === today.toDateString()) {
            startTime = new Date();
            endTime = new Date();
            endTime.setHours(23, 0, 0, 0);

            const timeSlotLabel = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            slots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);
        } else {
            startTime = new Date();
            startTime.setHours(7, 0, 0, 0);
            endTime = new Date();
            endTime.setHours(23, 0, 0, 0);

            const timeSlotLabel = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            slots.push(<MenuItem key={timeSlotLabel} value={timeSlotLabel}>{timeSlotLabel}</MenuItem>);
        }

        return slots;
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
                        <h4>4) Select Duration:</h4>
                        <FormControl fullWidth>
                            <Select
                                value={duration}
                                onChange={handleDurationChange}
                                displayEmpty
                                required
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Please Choose a Duration</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Please Choose a Duration</em>
                                </MenuItem>
                                <MenuItem value="2 Hours">2 Hours</MenuItem>
                                <MenuItem value="4 Hours">4 Hours</MenuItem>
                                <MenuItem value="All Day">All Day</MenuItem>
                            </Select>
                        </FormControl>
                        {!isAllDay && (
                            <>
                                <h4>5) Select Time Slot:</h4>
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
                                            <em>Available Time Slots<br /></em>
                                        </MenuItem>
                                        {timeSlots}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                        {isAllDay && (
                            <h4>5) All Day Reservation - No Specific Time Slot Needed</h4>
                        )}
                        <div className="next-button-container">
                            <button className="next-button" onClick={handleNextClick}>Next</button>
                        </div>
                    </div>
                </div>
                <div className="RightContainer">
                    <div className="box">
                        <div className="box-heading">UW Bothell Parking Locations</div>
                        <div className="image-container">
                            <img src={uwbMap} alt="UW Bothell Map" className="uwb-map" />
                            <div className={`marker ${selectedParkingLot === 'South Garage' ? 'selected' : ''}`} style={{ top: '85%', left: '55%' }} onClick={() => setSelectedParkingLot('South Garage')}>South Garage</div>
                            <div className={`marker ${selectedParkingLot === 'North Garage' ? 'selected' : ''}`} style={{ top: '37%', left: '52%' }} onClick={() => setSelectedParkingLot('North Garage')}>North Garage</div>
                            <div className={`marker ${selectedParkingLot === 'West Garage' ? 'selected' : ''}`} style={{ top: '55%', left: '32%' }} onClick={() => setSelectedParkingLot('West Garage')}>West Garage</div>
                            <div className={`marker ${selectedParkingLot === 'Truly Lot' ? 'selected' : ''}`} style={{ top: '71%', left: '40%' }} onClick={() => setSelectedParkingLot('Truly Lot')}>Truly Lot</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReserveParkingSpace;