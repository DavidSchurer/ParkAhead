import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button } from '@mui/material';
import styles from './ParkingAvailability.module.css';
import MyGoogleMap from './MyGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';

function ParkingAvailability() {
    const navigate = useNavigate();
    const [level, setLevel] = useState('');
    const { selectedParkingLot, startTime, endTime } = useParkingContext();

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
    }

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
                            <MenuItem value="" disabled><em>Please Choose a Parking Level:</em></MenuItem>
                            <MenuItem value="{1}" >Level 1</MenuItem>
                            <MenuItem value="{2}" >Level 2</MenuItem>
                            <MenuItem value="{3}" >Level 3</MenuItem>
                            <MenuItem value="{4}" >Level 4</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" disabled className={styles.TimeButton}>
                        Time: {`${startTime.time} ${startTime.period} - ${endTime.time} ${endTime.period}`}
                    </Button>
                </div>
                <div className={styles.ParkingLayout}>
                    <p>Please select your desired parking spot:</p>
                    <div className="ParkingLayout">
                        <p>Insert parking lot layout later in this area.</p>
                        {/* Mock parking lot layout */}
                        <div className={styles['parking-row']}>
                            <div className={styles['parking-spot']}>1</div>
                            <div className={styles['parking-spot']}>2</div>
                            <div className={styles['parking-spot']}>3</div>
                            <div className={styles['parking-spot']}>4</div>
                        </div>
                        <div className={styles['parking-row']}>
                            <div className={styles['parking-spot']}>5</div>
                            <div className={styles['parking-spot']}>6</div>
                            <div className={styles['parking-spot']}>7</div>
                            <div className={styles['parking-spot']}>8</div>
                        </div>
                        <div className={styles['parking-row']}>
                            <div className={styles['parking-spot']}>9</div>
                            <div className={styles['parking-spot']}>10</div>
                            <div className={styles['parking-spot']}>11</div>
                            <div className={styles['parking-spot']}>12</div>
                        </div>
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
                        5/25/2024 1:30pm @ UWB South Garage Spot #328 [Level 3]
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