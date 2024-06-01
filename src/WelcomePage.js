import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomePage.module.css';

function WelcomePage() {
    const navigate = useNavigate();

    const handleContinueClick = () => {
        navigate('/Login');
    };

    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeBox}>
                <h2 className={styles.welcomeHeader}>Welcome to UW Bothell Parking Reservation!</h2>
                <p className={styles.subHeading}><strong>Reserve Your Spot Today</strong></p>
                <p className={styles.welcomeMessage}>
                    Welcome to the UW Bothell Parking Reservation System! It's your portal to hassle-free parking on campus. Easily reserve your spot in any of our campus garages or lots, manage your reservations, and plan your campus visit with confidence.
                </p>
                <button className={styles.continueButton} onClick={handleContinueClick}>Continue</button>
                <p className={styles.developedBy}>Developed by David Schurer and Shivam Bakshi</p>
            </div>
        </div>
    );
};

export default WelcomePage;
