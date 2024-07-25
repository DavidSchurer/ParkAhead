import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ArrivalConfirmation = ({ reservationId, setReservations }) => {
  const [isLate, setIsLate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmArrival = async () => {
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
      } else {
        // Mark the reservation as confirmed
        await updateDoc(reservationDocRef, { isConfirmed: true });
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error confirming arrival:', error);
    }
  };

  const handleExtendReservation = async () => {
    try {
      const reservationDocRef = doc(db, 'reservations', reservationId);
      const reservationDoc = await getDoc(reservationDocRef);
      const reservationData = reservationDoc.data();

      // Check if the reservation has already ended
      const currentTime = new Date();
      if (currentTime > reservationData.endTime) {
        await deleteDoc(reservationDocRef);
        setShowConfirmation(true);
        return;
      }

      // Extend the reservation by 10 minutes
      const updatedReservationData = {
        ...reservationData,
        endTime: new Date(reservationData.endTime.getTime() + 10 * 60 * 1000),
      };
      await updateDoc(reservationDocRef, updatedReservationData);

      setIsLate(true);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error extending reservation:', error);
    }
  };

  return (
    <div>
      <button onClick={handleConfirmArrival}>Confirm Arrival</button>
      {isLate && (
        <button onClick={handleExtendReservation}>Extend Reservation</button>
      )}
      {showConfirmation && <p>Marked as here!</p>}
    </div>
  );
};

export default ArrivalConfirmation;