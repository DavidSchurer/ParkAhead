import React, { useState, useEffect } from 'react';
import styles from './ManageParking.module.css';
import { useParkingContext } from './ParkingContext';
import { db } from './firebase'; // Make sure to import your Firebase setup
import { collection, getDocs } from 'firebase/firestore';

const ManageParking = () => {
    const { reservations, setReservations } = useParkingContext();
    const [filteredBookings, setFilteredBookings] = useState(reservations);
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            const querySnapshot = await getDocs(collection(db, 'reservations'));
            const fetchedReservations = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, date: data.date.toDate() };
            });
            setReservations(fetchedReservations);
        };

        fetchReservations();
    }, [setReservations]);

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
                    const bookingDate = new Date(booking.date.toDate());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 7;
                });
            } else if (timeFilter === 'Next 30 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = new Date(booking.date.toDate());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 30;
                });
            } else if (timeFilter === 'Next 60 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = new Date(booking.date.toDate());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 60;
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

    return (
        <div className={styles.manageContainer}>
            <div className={styles.manageBox}>
                <h2 className={styles.manageHeader}>Confirmed Parking Reservations</h2>
                <div className={styles.filterContainer}>
                    <select className={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="">Location</option>
                        <option value="North Garage">North Garage</option>
                        <option value="South Garage">South Garage</option>
                        <option value="East Lot">East Lot</option>
                        <option value="West Garage">West Garage</option>
                    </select>
                    <select className={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">Category</option>
                        <option value="Standard">Standard</option>
                        <option value="Electric">Electric</option>
                        <option value="Handicap">Handicap</option>
                        <option value="Family">Family</option>
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
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.manageTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
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
                                    <td>{new Date(booking.date).toDateString()}</td>
                                    <td>{booking.startTime} - {booking.endTime}</td>
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