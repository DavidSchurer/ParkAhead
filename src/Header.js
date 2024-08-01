import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { db, auth } from './firebase';
import './Header.css';
import { useParkingContext } from './ParkingContext';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { reservations } = useParkingContext();
    const [showPopup, setShowPopup] = useState(false);
    const [numReservations, setNumReservations] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                const q = query(collection(db, 'reservations'), where('userEmail', '==', user.email));
                const unsubscribeReservations = onSnapshot(q, (querySnapshot) => {
                    setNumReservations(querySnapshot.size);
                }, (error) => {
                    console.log('Error fetching reservations:', error);
                });
                  return () => unsubscribeReservations();
                    
                } else {
                    setUserEmail('');
                    setNumReservations(0);
                }
            });

            return () => unsubscribeAuth();
    }, [reservations]);

    useEffect(() => {
        setShowDropdown(false);
    }, [location]);

    const handleReservationClick = (event) => {
        event.preventDefault();
        if (numReservations === 0) {
            navigate('/ReserveParkingSpace');
        } else if (numReservations > 0) {
            setShowPopup(true);
        }
    };

    const handleLogoutClick = () => {
        auth.signOut().then(() => {
            navigate('/Login');
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    const popupMessage = "You already have a spot reserved, you cannot reserve another spot until you cancel your current reservation or the current reservation has ended";

    const hideDropDown = location.pathname === '/Login' || location.pathname === '/CreateAccount' || location.pathname === '/' || location.pathname === '/ConfirmationPage';

    return (
        <div className="header">
            <div className="header-top">
                <h1>ParkAhead: <i>Parking Made Easy</i></h1>
                {!hideDropDown && (
                    <div className="menu-button" onClick={() => setShowDropdown(!showDropdown)}>
                    </div>
                )}
            </div>
            <div className={`dropdown ${showDropdown ? 'show' : ''}`}>
                <div className="dropdown-content">
                    <ul>
                        <li><Link to="/HomePage">Home</Link></li>
                        <li><Link to="/ReserveParkingSpace" onClick={handleReservationClick}>Reserve Parking Space</Link></li>
                        <li><Link to="/ArrivalConfirmation">Arrival Confirmation</Link></li>
                        <li><Link to="/ManageParking">Confirmed Parking Reservations</Link></li>
                        <li><Link to="/Settings">Settings</Link></li>
                    </ul>
                    <div className="dropdown-footer">
                        <span><strong>User:</strong> <strong>{userEmail}</strong></span>
                        <button className="logout-button" onClick={handleLogoutClick}><strong>Log Out</strong></button>
                    </div>
                </div>
            </div>
            <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle>Reservation Confirmation</DialogTitle>
                <DialogContent>
                    <p>{popupMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPopup(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Header;
