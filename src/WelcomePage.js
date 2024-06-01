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
                <h2 className={styles.welcomeHeader}>Welcome!</h2>
                <p className={styles.welcomeMessage}>We are glad to have you at the Parking Reservation Website.</p>
                <button className={styles.continueButton} onClick={handleContinueClick}>Continue</button>
            </div>
        </div>
    );
};

export default WelcomePage;