import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { IconButton } from '@mui/material';

const HomePage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [reservations, setReservations] = useState([]);
    const [profile, setProfile] = useState({ firstName: '', lastName: '', year: '', studentId: '' });

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

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            await deleteDoc(doc(db, 'vehicles', vehicleId));
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        try {
            await deleteDoc(doc(db, 'reservations', reservationId));
            setReservations(reservations.filter(reservation => reservation.id !== reservationId));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.header}>
                <h1>Welcome To ParkAhead: A UW Bothell Parking Reservation System!</h1>
                <p>Select an option below to navigate through the system.</p>
            </div>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Vehicles</h2>
                        <button className={styles.actionButton} onClick={() => handleNavigation('/AddVehicle')}>+ Add</button>
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
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Permits</h2>
                        <button className={styles.actionButton} onClick={() => handleNavigation('/purchase-permit')}>+ Purchase</button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Permit ID</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>12345</td>
                                <td>Automobile</td>
                                <td>Active</td>
                            </tr>
                            <tr>
                                <td>67890</td>
                                <td>Motorcycle</td>
                                <td>Expired</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Reservations</h2>
                        <button 
                            className={styles.actionButton} 
                            onClick={handleReservationClick}
                        >
                            + Reserve
                        </button>
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
                                    <td>{reservation.startTime} - {reservation.endTime}</td>
                                    <td>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReservation(reservation.id)}>
                                            ❌
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.userInfo}>
                    <h3>{`${profile.firstName} ${profile.lastName}`}</h3>
                    <p>Bothell Student</p>
                    <p>Year: {profile.year}</p>
                    <p>Student ID: {profile.studentId}</p>
                    <p>Balance Due: <span className={styles.balance}>$0.00</span></p>
                    <p>View Transaction History</p>
                    <button className={styles.editButton} onClick={() => navigate('/settings')}>Edit</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
