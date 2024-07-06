import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Avatar, Button } from '@mui/material';
import styles from './ParkingAvailability.module.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';
import { auth, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

function ParkingAvailability() {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState('');

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

    const { 
        selectedParkingLot, 
        startTime, 
        endTime, 
        reservation,
        reservationId, 
        selectedSpot, 
        setSelectedSpot, 
        selectedCategory, 
        setSelectedCategory,
        setReservations
    } = useParkingContext();

    const [level, setLevel] = useState('');
    const [displayedParkingSpots, setDisplayedParkingSpots] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const getSpotRange = (selectedLevel) => {
        const totalSpots = 40;
        const spotsPerLevel = totalSpots / 4;
        const startSpot = (selectedLevel - 1) * spotsPerLevel + 1;
        const endSpot = startSpot + spotsPerLevel - 1;
        return { start: startSpot, end: endSpot };
    };

    const handleSpotClick = (spotID, category) => {
        if (selectedSpot === spotID) {
            setSelectedSpot(null);
            setSelectedCategory('');
        } else {
            setSelectedSpot(spotID);
            setSelectedCategory(category);
        }
    };

    const generateParkingSpots = (start, end, level) => {
        const parkingSpots = [];
        for (let spotID = start; spotID <= end; spotID++) {
            let category = 'Standard';

            if (level === 1 && spotID <= 4) {
                category = 'Handicap';
            } else if (level === 2 && spotID >= 11 && spotID <= 14) {
                category = 'Electric';
            } else if (level === 2 && spotID >= 15 && spotID <= 20) {
                category = 'Standard';
            } else if (level === 3 && spotID >= 21 && spotID <= 24) {
                category = 'Electric';
            } else if (level === 3 && spotID >= 25 && spotID <= 30) {
                category = 'Standard';
            }

            const isFilteredOut = category !== categoryFilter && categoryFilter !== 'all';

            parkingSpots.push(
                <div 
                    key={spotID} 
                    className={`${styles['parking-spot']} ${selectedSpot === spotID ? styles['selected-spot'] : ''} ${isFilteredOut ? styles['filtered-out'] : ''}`}
                    onClick={() => !isFilteredOut && handleSpotClick(spotID, category)}
                    style={{ cursor: isFilteredOut ? 'not-allowed' : 'pointer', color: isFilteredOut ? 'transparent' : 'black' }}
                >
                    {spotID}
                </div>
            );
        }
        return parkingSpots;
    };

    const updateDisplayedSpots = (selectedLevel) => {
        const { start, end } = getSpotRange(selectedLevel);
        const spotsToDisplay = generateParkingSpots(start, end, selectedLevel);
        setDisplayedParkingSpots(spotsToDisplay);
    };

    useEffect(() => {
        if (level !== '') {
            updateDisplayedSpots(parseInt(level)); // Ensure level is parsed to integer
        } else {
            setDisplayedParkingSpots([]); // Reset to empty array if no level selected
        }
    }, [level, categoryFilter, selectedSpot]); // Include categoryFilter and selectedSpot in dependency array

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
    };

    const handlePreviousClick = () => {
        navigate('/ReserveParkingSpace');
    };

    const handleNextClick = async () => {
        if (selectedSpot && selectedCategory && reservationId && level) {
            const reservationDoc = doc(db, 'reservations', reservationId);
            try {
                await updateDoc(reservationDoc, {
                    spot: selectedSpot,
                    category: selectedCategory,
                    level: level,
                });

                setReservations(prevReservations =>
                    prevReservations.map(res =>
                        res.id === reservationId
                            ? { ...res, spot: selectedSpot, category: selectedCategory, level: level }
                            : res
                    )
                );
                navigate('/ConfirmationPage');
            } catch (error) {
                console.log('Error updating document: ', error);
            }
        } else {
            alert('Please fill out all required fields before proceeding.');
            console.log('No spot, category selected, or reservation ID missing');
            return;
        }
    };

    const handleLogoutClick = () => {
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
                    <Button 
                        variant="contained" disabled className={styles.TimeButton}>
                        Time: {startTime} - {endTime}
                    </Button>
                    <FormControl fullWidth>
                        <Select
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Select Category' }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="Standard">Standard</MenuItem>
                            <MenuItem value="Electric">Electric</MenuItem>
                            <MenuItem value="Handicap">Handicap</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={styles.ParkingLayout}>
                    <p>Please select your desired parking spot:</p>
                    <div className={styles['parking-grid']}>
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
                        <button className={styles['prev-button']} onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            </div>

            <div className={styles.RightContainer}>
                <div className={styles.Header}>
                    <Avatar alt="User Avatar" src={require('./avatarImage.png')} />
                    <span className={styles.Username}>{userEmail}</span>
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