import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl } from '@mui/material';
import './ReserveParkingSpace.css';

function ReserveParkingSpace() {
    const [parkingLot, setParkingLot] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState({ time: '12:00', period: 'AM' });
    const [endTime, setEndTime] = useState({ time: '12:00', period: 'AM' });

    const handleParkingLotChange = (event) => {
        setParkingLot(event.target.value);
    };

    const handleTimeChange = (type, field, value) => {
        if (type === 'start') {
            setStartTime({ ...startTime, [field]: value });
        } else {
            setEndTime({ ...endTime, [field]: value });
        }
    };

    const times = Array.from({ length: 12 }, (_, i) => (i + 1).toString()).flatMap(hour => 
        ['00', '30'].map(minute => `${hour}:${minute}`)
    );
    const periods = ['AM', 'PM'];

    return (
        <>
            <div className="MainHeading">
                <h1>Reserve Parking Space</h1>
            </div>

            <div className="Subheading">
                <h2>Please fill in the following information:</h2>
            </div>

            <div className="ReservationDetails">
                <h4>1) Select UWB Parking Lot/Parking Garage:</h4>
                <FormControl fullWidth>
                    <Select
                        value={parkingLot}
                        onChange={handleParkingLotChange}
                    >
                        <MenuItem value={'Lot A'}>Lot A</MenuItem>
                        <MenuItem value={'Lot B'}>Lot B</MenuItem>
                        <MenuItem value={'Lot C'}>Lot C</MenuItem>
                        <MenuItem value={'Lot D'}>Lot D</MenuItem>
                    </Select>
                </FormControl>

                <h4>2) Select Date:</h4>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    inline
                />

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

                <h4>4) Choose one of the following options:</h4>
            </div>
        </>
    );
}

export default ReserveParkingSpace;