/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.deleteReservation = functions.firestore
    .document('reservations/{reservationId}')
    .onWrite((change, context) => {
        const reservation = change.after.data();

        const currentDate = newDate();
        const reservationDate = reservation.date.toDate();
        const reservationEndTime = new Date(reservationDate.getTime() + reservation.endTime.toMillis());
        if (reservationDate <= currentDate && reservationEndTime <= currentDate) {
            return change.after.ref.delete();
        }

        return null;
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
