import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const displayTimeSlot = booking => {
    if (booking.startTime === '07:00 AM' && booking.endTime === '11:00 PM') {
        return 'All Day';
    } else {
        return `${booking.startTime} - ${booking.endTime}`
    }
}

const HomePage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [reservations, setReservations] = useState([]);
    const [profile, setProfile] = useState({ firstName: '', lastName: '', year: '', studentId: '' });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemType, setItemType] = useState('');

    const fetchUserEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    };

    const fetchVehicles = async () => {
        try {
            if (userEmail) {
                const q = query(collection(db, 'vehicles'), where('userEmail', '==', userEmail));
                const querySnapshot = await getDocs(q);
                const vehicleList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setVehicles(vehicleList);
            }
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
    };

    const fetchReservations = async () => {
        try {
            if (userEmail) {
                const q = query(collection(db, 'reservations'), where('userEmail', '==', userEmail));
                const querySnapshot = await getDocs(q);
                const reservationsList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
                        startTime: data.startTime,
                        endTime: data.endTime,
                        bookingName: data.bookingName,
                        parkingLot: data.parkingLot,
                        spot: data.spot,
                        level: data.level,
                    };
                });
                setReservations(reservationsList);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchUserEmail();
    }, []);

    useEffect(() => {
        if (userEmail) {
            fetchVehicles();
            fetchReservations();
            fetchProfile();
        }
    }, [userEmail]);

    const handleReservationClick = () => {
        if (reservations.length > 0) {
            alert("You already have a spot reserved, you cannot reserve another spot until you cancel your current reservation or the current reservation has ended");
        } else {
            navigate('/ReserveParkingSpace');
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleDeleteVehicle = (vehicleId) => {
        setItemToDelete(vehicleId);
        setItemType('vehicle');
        setDialogOpen(true);
    }

    const handleDeleteReservation = (reservationId) => {
        setItemToDelete(reservationId);
        setItemType('reservation');
        setDialogOpen(true);
    }

    const confirmDelete = async () => {
        try {
            if (itemType === 'vehicle') {
                await deleteDoc(doc(db, 'vehicles', itemToDelete));
                setVehicles(vehicles.filter(vehicle => vehicle.id !== itemToDelete));
            } else if (itemType === 'reservation') {
                await deleteDoc(doc(db, 'reservations', itemToDelete));
                setReservations(reservations.filter(reservation => reservation.id !== itemToDelete));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setDialogOpen(false);
            setItemToDelete(null);
            setItemType('');
        }
    };

    const cancelDelete = () => {
        setDialogOpen(false);
        setItemToDelete(null);
        setItemType('');
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.homeBox}>
            <div className={styles.header}>
                <h1>Welcome To ParkAhead: A UW Bothell Parking Reservation System!</h1>
                <p>Select an option below to navigate through the system.</p>
            </div>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Vehicles</h2>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Vehicle Make</th>
                                <th>Vehicle Model</th>
                                <th>Vehicle Color</th>
                                <th>Vehicle Type</th>
                                <th>Vehicle Year</th>
                                <th>License Plate</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id}>
                                    <td>{vehicle.make}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.color}</td>
                                    <td>{vehicle.type}</td>
                                    <td>{vehicle.year}</td>
                                    <td>{vehicle.licensePlate}</td>
                                    <td>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVehicle(vehicle.id)}>
                                            ❌
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className={styles.actionButton} onClick={() => handleNavigation('/AddVehicle')}>Add Vehicle</button>
                </div>
            </div>

            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Reservations</h2>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Parking Spot</th>
                                <th>Level</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.bookingName}</td>
                                    <td>{reservation.parkingLot}</td>
                                    <td>{reservation.spot}</td>
                                    <td>{reservation.level}</td>
                                    <td>{reservation.date ? reservation.date.toLocaleDateString() : 'N/A'}</td>
                                    <td>{displayTimeSlot(reservation)}</td>
                                    <td>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReservation(reservation.id)}>
                                            ❌
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                            className={styles.actionButton}
                            onClick={handleReservationClick}
                        >
                            Add Reservation
                        </button>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Profile</h2>
                    </div>
                    <div className={styles.profileInfo}>
                        <h3>{`${profile.firstName} ${profile.lastName}`}</h3>
                        <p>Bothell Student</p>
                        <p>Year: {profile.year}</p>
                        <p>Student ID: {profile.studentId}</p>
                        <p>Balance Due: <span className={styles.balance}>$0.00</span></p>
                        <p>View Transaction History</p>
                        <button className={styles.editButton} onClick={() => navigate('/settings')}>Edit</button>
                    </div>
                </div>
                <Dialog open={dialogOpen} onClose={cancelDelete}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete this {itemType}?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelDelete}>Cancel</Button>
                        <Button onClick={confirmDelete} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>

            <Dialog open={dialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this {itemType}?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>Cancel</Button>
                    <Button onClick={confirmDelete} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            </div>
        </div>
    );
};

export default HomePage;