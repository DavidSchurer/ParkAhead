import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Avatar, Button } from '@mui/material';
import styles from './ParkingAvailability.module.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';

function ParkingAvailability() {
    const navigate = useNavigate();
    const [level, setLevel] = useState('');
    const { selectedParkingLot, startTime, endTime, reservation } = useParkingContext();
    const [displayedParkingSpots, setDisplayedParkingSpots] = useState([]);

    // Constant variables to represent the number of rows and columns for the parking layout
    const numRows = 6;
    const numCols = 10; // 10 parking spots per row

    // Calculate the number of parking spots based on the level
    const getSpotRange = (selectedLevel) => {
        // Assuming 40 spots in total (10 per level)
        const totalSpots = 40;
        const spotsPerLevel = totalSpots / 4;
        const startSpot = (selectedLevel - 1) * spotsPerLevel + 1;
        const endSpot = startSpot + spotsPerLevel - 1;
        return { start: startSpot, end: endSpot };
    };

    // Generate the parking spots dynamically using a function
    const generateParkingSpots = (start, end) => {
        const parkingSpots = [];
        for (let spotID = start; spotID <= end; spotID++) {
            parkingSpots.push(<div key={spotID} className={styles['parking-spot']}>{spotID}</div>);
        }
        return parkingSpots;
    };

    const updateDisplayedSpots = (selectedLevel) => {
        const { start, end } = getSpotRange(selectedLevel);
        const spotsToDisplay = generateParkingSpots(start, end);
        setDisplayedParkingSpots(spotsToDisplay);
    };

    // Update displayed parking spots when level changes
    useEffect(() => {
        if (level !== '') {
            updateDisplayedSpots(parseInt(level)); // Ensure level is parsed to integer
        } else {
            setDisplayedParkingSpots([]); // Reset to empty array if no level selected
        }
    }, [level]);

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
    };

    const handlePreviousClick = () => {
        console.log('Previous button clicked');
        navigate('/ReserveParkingSpace');
    };

    const handleLogoutClick = () => {
        console.log('User has logged out');
        navigate('/Login');
    };

    return (
        <div className={styles.MainContainer}>
            <div className={`${styles.LeftContainer} ${styles.box}`}>
                <div className={styles.MainHeading}>
                    <h1>Check Availability</h1>
                </div>
                <div className={`${styles.Subheading} ${styles['box-heading']}`}>
                    <h2>Parking Lot: {selectedParkingLot}</h2>
                </div>
                <div className={styles.LevelTimeContainer}>
                    <FormControl fullWidth>
                        <Select
                            value={level}
                            onChange={handleLevelChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Select Level' }}
                        >
                            <MenuItem value=""><em>Please Choose a Parking Level:</em></MenuItem>
                            <MenuItem value="1">Level 1</MenuItem>
                            <MenuItem value="2">Level 2</MenuItem>
                            <MenuItem value="3">Level 3</MenuItem>
                            <MenuItem value="4">Level 4</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" disabled className={styles.TimeButton}>
                        Time: {`${startTime.time} ${startTime.period} - ${endTime.time} ${endTime.period}`}
                    </Button>
                </div>
                <div className={styles.ParkingLayout}>
                    <p>Please select your desired parking spot:</p>
                    <div className={styles['parking-grid']}>
                        {/* Render currently displayed parking spots */}
                        {displayedParkingSpots.length > 0 ? (
                            <div className={styles['grid-container']}>
                                {displayedParkingSpots}
                            </div>
                        ) : (
                            <p>No parking spots available for the selected level.</p>
                        )}
                    </div>
                    <div className={styles['next-button-container']}>
                        <button className={styles['next-button']} onClick={handlePreviousClick}>Previous</button>
                        <button className={styles['prev-button']}>Next</button>
                    </div>
                </div>
            </div>

            <div className={styles.RightContainer}>
                <div className={styles.Header}>
                    <Avatar alt="User Avatar" src={require('./avatarImage.png')} />
                    <span className={styles.Username}>dschurer</span>
                    <Button variant="outlined" className={styles.LogoutButton} onClick={handleLogoutClick}>Log Out</Button>
                </div>
                <div className={styles.box}>
                    <div className={styles['box-heading']}>Current Parking Spot Reservations</div>
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
                <div className={styles.box}>
                    <div className={styles['box-heading']}>UW Bothell Parking Locations</div>
                    <MyGoogleMap />
                </div>
            </div>
        </div>
    );
}

export default ParkingAvailability;