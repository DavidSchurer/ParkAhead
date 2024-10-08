import React, { useState, useEffect } from 'react';
import styles from './ManageParking.module.css';
import { useParkingContext } from './ParkingContext';
import { db, auth } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton } from '@mui/material';

const displayTimeSlot = booking=>{
    if(booking.startTime==='07:00 AM' && booking.endTime==='11:00 PM'){
        return 'All Day';
    }else{
        return `${booking.startTime} - ${booking.endTime}`
    }
}

const ManageParking = () => {
    const { reservations, setReservations } = useParkingContext();
    const [filteredBookings, setFilteredBookings] = useState(reservations);
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);

    useEffect(() => {
        const fetchUserEmail = () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            }
        };

        fetchUserEmail();
    }, []);

    const deletePastReservations = async () => {
        try {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const q = query(collection(db, 'reservations'), where('date', '<', Timestamp.fromDate(currentDate)));
            const querySnapshot = await getDocs(q);
    
            for (const reservationDoc of querySnapshot.docs) {
                await deleteDoc(doc(db, 'reservations', reservationDoc.id));
            }

            console.log('Past reservations deleted successfully');
        } catch (error) {
            console.error('Error deleting past reservations:', error);
        }
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                await deletePastReservations();
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                const q = query(collection(db, 'reservations'), where('date', '>=', Timestamp.fromDate(currentDate)));
                const querySnapshot = await getDocs(q);
                const userReservations = [];
                querySnapshot.forEach((doc) => {
                    userReservations.push({ id: doc.id, ...doc.data() });
                });
                setReservations(userReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservations();
    }, []);

    const handleDelete = (reservationId) => {
        setReservationToDelete(reservationId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (reservationToDelete) {
                await deleteDoc(doc(db, 'reservations', reservationToDelete));
                setReservations(reservations.filter(reservation => reservation.id !== reservationToDelete));
                setReservationToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleCloseDeleteDialog = () => {
        setReservationToDelete(null);
        setDeleteDialogOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setFilteredBookings(reservations);
    }, [reservations]);

    useEffect(() => {
        filterBookings();
    }, [locationFilter, categoryFilter, timeFilter, searchQuery, reservations]);

    const filterBookings = () => {
        let filtered = reservations;

        if (locationFilter) {
            filtered = filtered.filter(booking => booking.parkingLot === locationFilter);
        }

        if (categoryFilter) {
            filtered = filtered.filter(booking => booking.category === categoryFilter);
        }

        if (timeFilter) {
            const currentDate = new Date();

            if (timeFilter === 'Next 7 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = booking.date.toDate();
                    const daysDiff = Math.ceil((bookingDate - currentDate) / (1000 * 60 * 60 * 24));
                    return daysDiff >= 0 && daysDiff <= 7;
                });
            } else if (timeFilter === 'Next 30 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = booking.date.toDate();
                    const daysDiff = Math.ceil((bookingDate - currentDate) / (1000 * 60 * 60 * 24));
                    return daysDiff >= 0 && daysDiff <= 30;
                });
            } else if (timeFilter === 'Next 60 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = booking.date.toDate();
                    const daysDiff = Math.ceil((bookingDate - currentDate) / (1000 * 60 * 60 * 24));
                    return daysDiff >= 0 && daysDiff <= 60;
                });
            }
        }

        if (searchQuery) {
            filtered = filtered.filter(booking => booking.bookingName.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredBookings(filtered);
    };

    const handleClearFilters = () => {
        setLocationFilter('');
        setCategoryFilter('');
        setTimeFilter('');
        setSearchQuery('');
        setFilteredBookings(reservations);
    };

    const userReservations = reservations.filter(reservation => reservation.userEmail === userEmail);

    return (
            <div className={styles.confirmedContainer}>
                <div className={styles.confirmedBox}>
                    <h2 className={styles.confirmedHeader}>Confirmed Parking Reservations</h2>
                    <div className={styles.filterContainer}>
                        <select className={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                            <option value="">Location</option>
                            <option value="North Garage">North Garage</option>
                            <option value="South Garage">South Garage</option>
                            <option value="Truly Lot">Truly Lot</option>
                            <option value="West Garage">West Garage</option>
                        </select>
                        <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="">Category</option>
                            <option value="Standard">Standard</option>
                            <option value="Electric">Electric</option>
                            <option value="Handicap">Handicap</option>
                        </select>
                        <select className={styles.filterSelect} value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                            <option value="">Time Frame</option>
                            <option value="Next 7 days">Next 7 days</option>
                            <option value="Next 30 days">Next 30 days</option>
                            <option value="Next 60 days">Next 60 days</option>
                        </select>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search by reservation name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className={styles.clearButton} onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                        <div className={styles.manageBox}>
                            <button className={styles.manageButton} onClick={handleOpen}>Manage Your Reservations</button>
                            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                                <DialogTitle><h2 className={styles.manageReservationsHeader}>Your Reservations</h2></DialogTitle>
                                <DialogContent>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.confirmedTable}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Location</th>
                                                    <th>Parking Spot</th>
                                                    <th>Level</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Category</th>
                                                    <th>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userReservations.map((reservation) => (
                                                    <tr key={reservation.id}>
                                                        <td>{reservation.bookingName}</td>
                                                        <td>{reservation.parkingLot}</td>
                                                        <td>{reservation.spot}</td>
                                                        <td>{reservation.level}</td>
                                                        <td>{reservation.date.toDate().toLocaleDateString()}</td>
                                                        <td>{reservation.startTime} - {reservation.endTime}</td>
                                                        <td>{reservation.category}</td>
                                                        <td>
                                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(reservation.id)}>
                                                                ❌
                                                            </IconButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <div className={styles.closeButtonContainer}>
                                        <button className={styles.closeButton} onClick={handleClose}>Close</button>
                                    </div>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                    <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <p>Are you sure you want to delete this reservation?</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog} color="primary">No</Button>
                            <Button onClick={handleConfirmDelete} color="primary" autoFocus>Yes</Button>
                        </DialogActions>
                    </Dialog>
                    <div className={styles.tableContainer}>
                        <table className={styles.confirmedTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Parking Spot</th>
                                    <th>Level</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.bookingName}</td>
                                        <td>{booking.parkingLot}</td>
                                        <td>{booking.spot}</td>
                                        <td>{booking.level}</td>
                                        <td>{booking.date.toDate().toLocaleDateString()}</td>
                                        <td>{displayTimeSlot(booking)}</td>
                                        <td>{booking.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
};

export default ManageParking;