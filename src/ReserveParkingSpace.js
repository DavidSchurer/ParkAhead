import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button } from '@mui/material';
import './ReserveParkingSpace.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';

function ReserveParkingSpace() {
    // State variables used to manage the selected date, start time, end time, and selected parking lot
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const { selectedParkingLot, setSelectedParkingLot, startTime, setStartTime, endTime, setEndTime } = useParkingContext();

    // Hook used for navigation
    const navigate = useNavigate();

    // Handler function used for changing the parking lot selection
    const handleParkingLotChange = (event) => {
        setSelectedParkingLot(event.target.value);
    };

    // Handler function for changing selected time
    const handleTimeChange = (type, field, value) => {
        if (type === 'start') {
            setStartTime({ ...startTime, [field]: value }); // Update start time
        } else {
            setEndTime({ ...endTime, [field]: value }); // Update end time
        }
    };

    // Handler function for option selection (parking permit or no parking permit)
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    // Handler function for clicking next button
    const handleNextClick = () => {
        console.log('Next button clicked. Selected option:', selectedOption);
        navigate('/ParkingAvailability'); // Navigate to the parking availability page upon click
    };

    const handleLogoutClick = () => {
        console.log('User has logged out');
        navigate('/');
    };

    // Time options generated for the dropdown selection
    const times = Array.from({ length: 12 }, (_, i) => (i + 1).toString()).flatMap(hour => 
        ['00', '30'].map(minute => `${hour}:${minute}`)
    );
    const periods = ['AM', 'PM'];

    return (
        <>
        <div className="MainContainer">
            {/*Content on left side of webpage*/}
            <div className="LeftContainer">
                <div className="MainHeading">
                    <h1>Reserve Parking Space</h1>
                </div>

                <div className="Subheading">
                    <h2>Please fill in the following information:</h2>
                </div>

                <div className="ReservationDetails">
                    {/*Parking Garage/Lot Selection Dropdown*/}
                    <h4>1) Select UWB Parking Lot/Parking Garage:</h4>
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

                    {/*Calendar for picking date of parking reservation*/}
                    <h4>2) Select Date:</h4>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="MMMM d, yyyy"
                        inline
                    />

                    {/*Buttons for selecting start and end time of parking spot reservation*/}
                    <h4>3) Select Time:</h4>
                    <div className="time-picker">
                        <div className="time-picker-item">
                            <p><strong>From:</strong></p>
                            <FormControl fullWidth>
                                <Select
                                    value={startTime.time}
                                    onChange={(e) => handleTimeChange('start', 'time', e.target.value)}
                                >
                                    {times.map((time) => (
                                        <MenuItem key={time} value={time}>{time}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <Select
                                    value={startTime.period}
                                    onChange={(e) => handleTimeChange('start', 'period', e.target.value)}
                                >
                                    {periods.map((period) => (
                                        <MenuItem key={period} value={period}>{period}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="time-picker-item">
                            <p><strong>To:</strong></p>
                            <FormControl fullWidth>
                                <Select
                                    value={endTime.time}
                                    onChange={(e) => handleTimeChange('end', 'time', e.target.value)}
                                >
                                    {times.map((time) => (
                                        <MenuItem key={time} value={time}>{time}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <Select
                                    value={endTime.period}
                                    onChange={(e) => handleTimeChange('end', 'period', e.target.value)}
                                >
                                    {periods.map((period) => (
                                        <MenuItem key={period} value={period}>{period}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>


                    {/*Selection buttons for having parking permit or no parking permit*/}
                    <h4>4) Choose one of the following options:</h4>
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

                    {/*Next button*/}
                    <div className="next-button-container">
                        <button className="next-button" onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            </div>

            {/*Content on right side of webpage*/}
            <div className="RightContainer">

                {/*Header for username, icon, and log out button*/}
                <div className="Header">
                <Avatar alt="User Avatar" src={require('./avatarImage.png')} />
                    <span className="Username">dschurer</span>
                    <Button variant="outlined" className="LogoutButton" onClick={handleLogoutClick}>Log Out</Button>
                </div>

                {/*Current parking spot reservations info*/}
                <div className="box">
                    <div className="box-heading">Current Parking Spot Reservations</div>
                    <div className="placeholder-text">
                        5/25/2024 1:30pm @ UWB South Garage Spot #328 [Level 3]
                    </div>
                </div>

                {/*UW Bothell Parking Locations Map (Using Google Maps API)*/}
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