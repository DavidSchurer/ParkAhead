import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { db, auth } from './firebase';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [numReservations, setNumReservations] = useState(0);
    const [userEmail, setUserEmail] = useState('');

    const handleDeletePastReservationsClick = async () => {
        try {
            const currentDate = new Date();
            const currentDateString = currentDate.toLocaleDateString();

            const q = query(collection(db, 'reservations'), where('date', '<', currentDateString));
            const querySnapshot = await getDocs(q);

            const batch = db.batch();

            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            console.log('Past reservations deleted successfully');
        } catch (error) {
            console.error('Error deleting past reservations:', error);
        }

    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
            const q = query(collection(db, 'reservations'), where('userEmail', '==', user.email));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setNumReservations(querySnapshot.size);
            }, (error) => {
                console.error('Error fetching reservations:', error);
            });
            
            return () => unsubscribe();
        }
    }, []);

    const handleReservationClick = (event) => {
        event.preventDefault();
        if (numReservations === 0) {
            navigate('/ReserveParkingSpace');
        } else if (numReservations > 0) {
            setShowPopup(true);
        }
    };

    const popupMessage = "You already have a spot reserved, you cannot reserve another spot until you cancel your current reservation or the current reservation has ended";

    return (
        <div className="header">
            <h1>ParkAhead: <i>Parking Made Easy</i></h1>
            <nav>
                <ul>
                    <li><Link to="/HomePage">Home</Link></li>
                    <li><Link to="/ReserveParkingSpace" onClick={handleReservationClick}>Reserve Parking Space</Link></li>
                    <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                        <DialogTitle>Reservation Confirmation</DialogTitle>
                        <DialogContent>
                            <p>{popupMessage}</p>
                        </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setShowPopup(false)}>OK</Button>
                            </DialogActions>
                    </Dialog>
                    <li><Link to="/ParkingAvailability">Check Parking Space Availability</Link></li>
                    <li><Link to="/ArrivalConfirmation">Arrival Confirmation</Link></li>
                    <li><Link to="/ManageParking" onClick={handleDeletePastReservationsClick}>Confirmed Parking Reservations</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;