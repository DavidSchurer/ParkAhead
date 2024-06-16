import React, { useState, useEffect, useRef } from 'react';
import styles from './ManageParking.module.css';
import { useParkingContext } from './ParkingContext';

const ManageParking = () => {
    const { reservation } = useParkingContext();
    const previousReservation = useRef(null);

    const [bookings, setBookings] = useState([
        { name: 'Shivam Bakshi', space: 'PS-101', location: 'North Garage', time: '9:00am - 11:00am, June 5, 2024', category: 'Standard' },
        { name: 'Ben Schipunov', space: 'PS-202', location: 'South Garage', time: '9:30am - 11:30am, June 5, 2024', category: 'Electric' },
        { name: 'Selina Nguyen', space: 'PS-303', location: 'East Lot', time: '9:30am - 11:00am, June 5, 2024', category: 'Handicap' },
        { name: 'Reagan Vu', space: 'PS-404', location: 'West Garage', time: '11:00am - 1:00pm, June 5, 2024', category: 'Standard' },
        { name: 'Jeffrey Kim', space: 'PS-505', location: 'North Garage', time: '11:00am - 1:00pm, June 5, 2024', category: 'Electric' },
        { name: 'John Smith', space: 'PS-606', location: 'South Garage', time: '11:00am - 1:00pm, June 5, 2024', category: 'Handicap' }
    ]);

    const [filteredBookings, setFilteredBookings] = useState(bookings);
    const [locationFilter, setLocationFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (reservation && reservation !== previousReservation.current) {
            setBookings(prevBookings => [
                ...prevBookings,
                {
                    name: reservation.bookingName,
                    space: 'PS-999',
                    location: reservation.parkingLot,
                    time: `${reservation.startTime} - ${reservation.endTime}, ${new Date(reservation.date).toLocaleDateString()}`,
                    category: 'User Reserved'
                }
            ]);
            previousReservation.current = reservation;
        }
    }, [reservation]);

    useEffect(() => {
        filterBookings();
    }, [locationFilter, categoryFilter, timeFilter, searchQuery, bookings]);

    const filterBookings = () => {
        let filtered = bookings;

        if (locationFilter) {
            filtered = filtered.filter(booking => booking.location === locationFilter);
        }

        if (categoryFilter) {
            filtered = filtered.filter(booking => booking.category === categoryFilter);
        }

        if (timeFilter) {
            // Time filtering logic
            const currentDate = new Date();

            if (timeFilter === 'Next 7 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = new Date(booking.time.split(',')[1].trim());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 7;
                });
            } else if (timeFilter === 'Next 30 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = new Date(booking.time.split(',')[1].trim());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 60;
                });
            } else if (timeFilter === 'Next 60 days') {
                filtered = filtered.filter(booking => {
                    const bookingDate = new Date(booking.time.split(',')[1].trim());
                    return (bookingDate - currentDate) / (1000 * 60 * 60 * 24) <= 60;
                });
            }
        }

        if (searchQuery) {
            filtered = filtered.filter(booking => booking.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setFilteredBookings(filtered);
    };

    const handleClearFilters = () => {
        setLocationFilter('');
        setCategoryFilter('');
        setTimeFilter('');
        setSearchQuery('');
        setFilteredBookings(bookings);
    };

    return (
        <div className={styles.manageContainer}>
            <div className={styles.manageBox}>
                <h2 className={styles.manageHeader}>Manage Parking Reservations</h2>
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
                    </select>
                    <select className={styles.filterSelect} value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                        <option value="">When</option>
                        <option value="Next 7 days">Next 7 days</option>
                        <option value="Next 30 days">Next 30 days</option>
                        <option value="Next 60 days">Next 60 days</option>
                    </select>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search reservation name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className={styles.searchButton} onClick={filterBookings}>Search</button>
                    <button className={styles.clearButton} onClick={handleClearFilters}>Clear</button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.manageTable}>
                        <thead>
                            <tr>
                                <th>Reservation Name</th>
                                <th>Parking Space</th>
                                <th>Garage/Parking Location</th>
                                <th>Time Duration</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{booking.name}</td>
                                    <td>{booking.space}</td>
                                    <td>{booking.location}</td>
                                    <td>{booking.time}</td>
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