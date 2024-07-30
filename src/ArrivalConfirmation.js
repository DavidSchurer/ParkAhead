import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDocs, where, query, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import styles from './ArrivalConfirmation.module.css';

const ArrivalConfirmation = () => {
    const [reservations, setReservations] = useState([]);
    const [reservationTimeouts, setReservationTimeouts] = useState({});
    const [popupMessage, setPopupMessage] = useState('');
    const [countdown, setCountdown] = useState(null);
    const [extendedReservationId, setExtendedReservationId] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    console.log('Fetching reservations for user:', user.email);
                    const reservationsQuery = query(
                        collection(db, 'reservations'),
                        where('userEmail', '==', user.email)
                    );
                    const querySnapshot = await getDocs(reservationsQuery);

                    const reservationsData = [];
                    const timeouts = {};
                    const currentTime = new Date();

                    querySnapshot.forEach((doc) => {
                        const reservationData = doc.data();
                        const isLate = currentTime > reservationData.startTime.toDate();

                        const reservation = {
                            id: doc.id,
                            ...reservationData,
                            isLate: isLate,
                        };

                        console.log('Fetched reservation:', reservation);

                        reservationsData.push(reservation);

                        // Set a timeout to auto-cancel if neither button is pressed within 10 minutes
                        if (isLate) {
                            const timeDiff = currentTime - reservationData.startTime.toDate();
                            if (timeDiff < 10 * 60 * 1000) {
                                const remainingTime = 10 * 60 * 1000 - timeDiff;
                                timeouts[doc.id] = setTimeout(() => {
                                    autoCancelReservation(doc.id);
                                }, remainingTime);
                            } else {
                                autoCancelReservation(doc.id);
                            }
                        }
                    });

                    setReservations(reservationsData);
                    setReservationTimeouts(timeouts);
                }
            } catch (error) {
                console.log('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        if (countdown !== null) {
            const timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        autoCancelReservation(extendedReservationId);
                        return null;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown, extendedReservationId]);

    const handleConfirmArrival = async (reservationId) => {
        try {
            const reservationDocRef = doc(db, 'reservations', reservationId);
            await updateDoc(reservationDocRef, {
                status: 'arrived',
            });
            clearTimeout(reservationTimeouts[reservationId]);
            setPopupMessage('Thank you for checking in. Have a good day on campus!');
        } catch (error) {
            console.log('Error confirming arrival:', error);
        }
    };

    const handleExtendReservation = async (reservationId) => {
        try {
            const reservationDocRef = doc(db, 'reservations', reservationId);
            const reservationSnapshot = await getDoc(reservationDocRef);
            const reservationData = reservationSnapshot.data();
            const newEndTime = new Date(reservationData.endTime.toDate().getTime() + 15 * 60 * 1000);

            await updateDoc(reservationDocRef, {
                endTime: newEndTime,
            });
            clearTimeout(reservationTimeouts[reservationId]);
            setPopupMessage('Your reservation start time has been extended by 15 minutes.');
            setCountdown(15 * 60); // Set countdown timer for 15 minutes
            setExtendedReservationId(reservationId); // Store the extended reservation ID
        } catch (error) {
            console.log('Error extending reservation:', error);
        }
    };

    const autoCancelReservation = async (reservationId) => {
        try {
            const reservationDocRef = doc(db, 'reservations', reservationId);
            await deleteDoc(reservationDocRef);
            setReservations((prevReservations) => prevReservations.filter((res) => res.id !== reservationId));
        } catch (error) {
            console.log('Error auto-canceling reservation:', error);
        }
    };

    return (
        <div className={styles.confirmationContainer}>
            <div className={styles.confirmationBox}>
                {popupMessage && (
                    <div className={styles.popupMessage}>
                        {popupMessage}
                    </div>
                )}
                {reservations.length > 0 ? (
                    reservations.map((reservation, index) => (
                        <div key={index} className={styles.reservationDetails}>
                            {reservation.isLate && (
                                <p style={{ color: 'red' }}>You are late for your reservation.</p>
                            )}
                            <p>
                                <strong>Name:</strong> {reservation.bookingName} <br />
                                <strong>Location:</strong> {reservation.parkingLot} <br />
                                <strong>Parking Spot:</strong> {reservation.spot} <br />
                                <strong>Level:</strong> {reservation.level} <br />
                                <strong>Date:</strong> {reservation.date.toDate().toLocaleDateString()} <br />
                                <strong>Time:</strong> {reservation.startTime.toDate().toLocaleTimeString()} - {reservation.endTime.toDate().toLocaleTimeString()} <br />
                                <strong>Category:</strong> {reservation.category}
                            </p>
                            <div className={styles.buttonContainer}>
                                <button className={styles.confirmButton} onClick={() => handleConfirmArrival(reservation.id)}>
                                    Confirm Arrival
                                </button>
                                <button className={styles.extendButton} onClick={() => handleExtendReservation(reservation.id)}>
                                    Extend Reservation
                                </button>
                            </div>
                            {countdown !== null && extendedReservationId === reservation.id && (
                                <div className={styles.countdownTimer}>
                                    Time remaining: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No reservation has been made</p>
                )}
            </div>
        </div>
    );
};

export default ArrivalConfirmation;
