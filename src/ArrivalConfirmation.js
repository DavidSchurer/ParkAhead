import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDocs, where, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from './ArrivalConfirmation.module.css';

const ArrivalConfirmation = () => {
  const [reservations, setReservations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
          const reservationsLateStatus = [];

          querySnapshot.forEach((doc) => {
            const reservationData = doc.data();
            const currentTime = new Date();
            const isReservationLate = currentTime > reservationData.startTime;

            reservationsData.push({
              ...reservationData,
              isLate: isReservationLate,
            });
          });

          setReservations(reservationsData);
        }
      } catch (error) {
        console.log('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleConfirmArrival = async (reservationId) => {
    try {
      const reservationDocRef = doc(db, 'reservations', reservationId);
      const reservationDoc = await getDocs(reservationDocRef);
      const reservationData = reservationDoc.data();

      if (reservationData.isLate) {
        // Extend the reservation by 10 minutes
        const updatedReservationData = {
          ...reservationData,
          endTime: new Date(reservationData.endTime.getTime() + 10 * 60 * 1000),
        };
        await updateDoc(reservationDocRef, updatedReservationData);
      } else {
        // Mark the reservation as confirmed
        await updateDoc(reservationDocRef, { isConfirmed: true });
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error confirming arrival:', error);
    }
  };

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
      </div>
    </div>
  );
};

export default ArrivalConfirmation;