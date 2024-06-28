import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.header}>
                <h1>Welcome to UW Bothell Parking System</h1>
                <p>Select an option below to navigate through the system</p>
            </div>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Vehicles</h2>
                        <button className={styles.actionButton} onClick={() => handleNavigation('/add-vehicle')}>+ Add</button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Plate</th>
                                <th>State</th>
                                <th>Type</th>
                                <th>Make</th>
                                <th>Color</th>
                                <th>Style</th>
                                <th>Permit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>Washington</td>
                                <td>Automobile</td>
                                <td>BMW</td>
                                <td>White</td>
                                <td>Two Door</td>
                                <td>Permit A</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Washington</td>
                                <td>Automobile</td>
                                <td>Toyota</td>
                                <td>Red</td>
                                <td>Four Door</td>
                                <td>Permit B</td>
                            </tr>
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
