import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MenuItem, Select, FormControl, Avatar, Button } from '@mui/material';
import styles from './ParkingAvailability.module.css';
import MyGoogleMap from './MyGoogleMap';

function ParkingAvailability() {
    return (
        <div className={styles.MainContainer}>
                <div className={styles.MainHeading}>
                    <h1>Check Availability</h1>
                </div>
            <div className={`${styles.LeftContainer} ${styles.box}`}>
                <div className={`${styles.Subheading} ${styles['box-heading']}`}>
                    <h2>Parking Lot</h2>
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
                        <button className={styles['next-button']}>Previous</button>
                        <button className={styles['prev-button']}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParkingAvailability;