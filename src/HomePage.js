import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton } from '@mui/material';

const HomePage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [userEmail, setUserEmail] = useState('');

    const fetchUserEmail = async () => {
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    };

    const fetchVehicles = async () => {
        try {
            const q = query(collection(db, 'vehicles'), where('userEmail', '==', userEmail));
            const querySnapshot = await getDocs(q);
            const vehicleList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setVehicles(vehicleList);
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
    };

    useEffect(() => {
        fetchUserEmail();
        fetchVehicles();
    }, [userEmail]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleDelete = async (vehicleId) => {
        try {
            await deleteDoc(doc(db, 'vehicles', vehicleId));
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
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
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(vehicle.id)}>
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
                        <h2>Citations</h2>
                        <button className={styles.actionButton} onClick={() => handleNavigation('/view-citations')}>+ View</button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Citation ID</th>
                                <th>Issue Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>98765</td>
                                <td>01/01/2023</td>
                                <td>Paid</td>
                            </tr>
                            <tr>
                                <td>54321</td>
                                <td>12/12/2022</td>
                                <td>Unpaid</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.userInfo}>
                    <h3>SHIVAM BAKSHI</h3>
                    <p>Bothell Student</p>
                    <p>Balance Due: <span className={styles.balance}>$0.00</span></p>
                    <p>View Transaction History</p>
                    <button className={styles.editButton}>Edit</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;