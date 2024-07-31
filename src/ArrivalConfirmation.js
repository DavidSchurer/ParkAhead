import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDocs, where, query, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import styles from './ArrivalConfirmation.module.css';

const ArrivalConfirmation = () => {
  const [reservations, setReservations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const reservationsQuery = query(
            collection(db, 'reservations'),
            where('userEmail', '==', user.email)
          );
          const querySnapshot = await getDocs(reservationsQuery);

          const reservationsData = [];
          querySnapshot.forEach((doc) => {
            reservationsData.push({
                id: doc.id,
                ...doc.data(),
                isConfirmed: doc.data().isConfirmed || false,
            });
          });
          setReservations(reservationsData);

          const anyConfirmed = reservationsData.some(reservation => reservation.isConfirmed);
          if (anyConfirmed) {
            setTimerActive(false);
          }
        }
      } catch (error) {
        console.log('Error fetching reservations:', error);
      }
    };

    fetchReservations();

    const countdownInterval = setInterval(() => {
      if (timerActive) {
        setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
                clearInterval(countdownInterval);
                return 0;
            }
            return prevCountdown - 1;
        });
      }
    }, 1000);

    return () => {
        clearInterval(countdownInterval);
    };
  }, [timerActive]);

  const handleTimerEnd = async () => {
    if (timerActive) {
      try {
        const user = auth.currentUser;
        if (user) {
          const reservationsQuery = query(
            collection(db, 'reservations'),
            where('userEmail', '==', user.email)
          );
          const querySnapshot = await getDocs(reservationsQuery);
  
          const reservationsToDelete = querySnapshot.docs.map(doc => doc.id);
          for (const reservationId of reservationsToDelete) {
            await deleteDoc(doc(db, 'reservations', reservationId));
          }
  
          setReservations([]);
        }
      } catch (error) {
        console.error('Error deleting reservations:', error);
      }
      setTimerActive(false);
    }
  };

  const handleConfirmArrival = async (reservationId) => {
    setTimerActive(false);

    try {
      const reservationDocRef = doc(db, 'reservations', reservationId);
      const reservationDoc = await getDoc(reservationDocRef);
      const reservationData = reservationDoc.data();

      if (reservationData.isLate) {
        // Extend the reservation by 10 minutes
        const updatedReservationData = {
          ...reservationData,
          endTime: new Date(reservationData.endTime.getTime() + 10 * 60 * 1000),
        };
        await updateDoc(reservationDocRef, updatedReservationData);
      }
        // Mark the reservation as confirmed
      await updateDoc(reservationDocRef, { isConfirmed: true });

      setShowConfirmation(true);
      setTimerActive(false);
    } catch (error) {
      console.error('Error confirming arrival:', error);
    }
  };

  const formattedCountdown = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`;

  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.confirmationBox}>
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
              <strong>Time</strong> {reservation.startTime} - {reservation.endTime} <br />
              <strong>Category:</strong> {reservation.category}
            </p>
            <div className={styles.buttonContainer}>
              <button className={styles.confirmButton} onClick={() => handleConfirmArrival(reservation.id)}>
                Confirm Arrival
              </button>
              <button className={styles.extendButton}>
                Extend Reservation
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No reservation has been made</p>
      )}
      {showConfirmation && <p>Reservation confirmed!</p>}
      <p>Time remaining: {formattedCountdown}</p>
      </div>
    </div>
  );
};

export default ArrivalConfirmation;