import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingContext } from './ParkingContext';
import styles from './ConfirmationPage.module.css';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function ConfirmationPage() {
    const navigate = useNavigate();
    const { reservationId } = useParkingContext();
    const [reservationDetails, setReservationDetails] = useState(null);

    useEffect(() => {
        const fetchReservationDetails = async () => {
            if (reservationId) {
                const reservationDoc = doc(db, 'reservations', reservationId);
                try {
                    const docSnap = await getDoc(reservationDoc);
                    if (docSnap.exists()) {
                        setReservationDetails(docSnap.data());
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.log('Error getting document:', error);
                }
            }
        };

        fetchReservationDetails();
    }, [reservationId]);

    const handleConfirmClick = () => {
        console.log('Reservation confirmed');
        navigate('/HomePage');
    };

    const handleBackClick = () => {
        console.log('Back to parking selection');
        navigate('/ParkingAvailability');
    };

    return (
        <div className={styles.confirmationContainer}>
            <div className={styles.confirmationBox}>
                <h2 className={styles.confirmationHeader}>Reservation Confirmed</h2>
                <p className={styles.confirmationMessage}>
                  Thank you for choosing ParkAhead! Your reservation has been successfully confirmed. Please ensure to check in within 10 minutes of your start time to secure your spot, or it may be assigned to another user. You can cancel this reservation anytime before the start time without any penalties.
                </p>
                {reservationDetails ? (
                    <div className={styles.reservationDetails}>
                        <p><strong>Parking Lot:</strong> {reservationDetails.parkingLot}</p>
                        <p><strong>Spot:</strong> {reservationDetails.spot}</p>
                        <p><strong>Level:</strong> {reservationDetails.level}</p>
                        <p><strong>Date:</strong> {new Date(reservationDetails.date.seconds * 1000).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {reservationDetails.startTime} - {reservationDetails.endTime}</p>
                        <p><strong>Category:</strong> {reservationDetails.category}</p>
                    </div>
                ) : (
                    <p>No reservation details available.</p>
                )}
                <button className={styles.confirmButton} onClick={handleConfirmClick}>OK</button>
            </div>
        </div>
    )
}

export default ConfirmationPage;