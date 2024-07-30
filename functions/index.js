const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteReservation = functions.firestore
    .document("reservations/{reservationId}")
    .onWrite((change, context) => {
      const reservation = change.after.data();

      if (!reservation) {
        return null;
      }

      const currentDate = new Date();
      const reservationDate = reservation.date.toDate();
      const reservationEndTime = new Date(
          reservationDate.getTime() + reservation.endTime.toMillis());

      if (reservationEndTime <= currentDate) {
        return admin.firestore().doc(context.params.reservationId).delete();
      }

      return null;
    });
