import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { updatePassword, updateEmail } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import styles from './HomePage.module.css'; // Reusing the same CSS file

const Settings = () => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [vehicle, setVehicle] = useState({ make: '', model: '', color: '', type: '', year: '', licensePlate: '' });
    const [vehicles, setVehicles] = useState([]);

    // Profile settings state
    const [year, setYear] = useState('');
    const [studentId, setStudentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        const fetchUserEmail = () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            }
        };

        const fetchVehicles = async () => {
            const user = auth.currentUser;
            if (user) {
                const vehiclesQuery = query(
                    collection(db, 'vehicles'),
                    where('userEmail', '==', user.email)
                );
                const querySnapshot = await getDocs(vehiclesQuery);
                const vehiclesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setVehicles(vehiclesData);
            }
        };

        const fetchProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
                if (profileDoc.exists()) {
                    const profileData = profileDoc.data();
                    setYear(profileData.year || '');
                    setStudentId(profileData.studentId || '');
                    setFirstName(profileData.firstName || '');
                    setLastName(profileData.lastName || '');
                }
            }
        };

        fetchUserEmail();
        fetchVehicles();
        fetchProfile();
    }, [userEmail]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                await updatePassword(user, password);
                alert('Password updated successfully.');
                setPassword('');
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                await updateEmail(user, newEmail);
                alert('Email updated successfully.');
                setUserEmail(newEmail);
                setNewEmail('');
            }
        } catch (error) {
            console.error('Error updating email:', error);
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = await addDoc(collection(db, 'vehicles'), {
                    ...vehicle,
                    userEmail: user.email
                });
                setVehicles([...vehicles, { id: docRef.id, ...vehicle }]);
                setVehicle({ make: '', model: '', color: '', type: '', year: '', licensePlate: '' });
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        try {
            await deleteDoc(doc(db, 'vehicles', vehicleId));
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, 'profiles', user.uid), {
                    year,
                    studentId,
                    firstName,
                    lastName,
                });
                alert('Profile updated successfully.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.header}>
                <h1>Settings</h1>
            </div>
            <div className={styles.sectionContainer}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Change Password</h2>
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <div className={styles.formGroup}>
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.actionButton}>
                            Update Password
                        </button>
                    </form>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Update Email</h2>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Current Email:</label>
                        <div className={styles.currentEmailBox}>{userEmail}</div>
                    </div>
                    <form onSubmit={handleEmailChange}>
                        <div className={styles.formGroup}>
                            <label>New Email:</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.actionButton}>
                            Update Email
                        </button>
                    </form>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Add Vehicle</h2>
                    </div>
                    <form onSubmit={handleAddVehicle}>
                        <div className={styles.formGroup}>
                            <label>Make:</label>
                            <input
                                type="text"
                                value={vehicle.make}
                                onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Model:</label>
                            <input
                                type="text"
                                value={vehicle.model}
                                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Color:</label>
                            <input
                                type="text"
                                value={vehicle.color}
                                onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Type:</label>
                            <input
                                type="text"
                                value={vehicle.type}
                                onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Year:</label>
                            <input
                                type="text"
                                value={vehicle.year}
                                onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>License Plate:</label>
                            <input
                                type="text"
                                value={vehicle.licensePlate}
                                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.actionButton}>
                            Add Vehicle
                        </button>
                    </form>
                    <div>
                        <h3>Your Vehicles</h3>
                        <ul>
                            {vehicles.map((v) => (
                                <li key={v.id}>
                                    {`${v.make} ${v.model} (${v.year}) - ${v.color} - ${v.type} - ${v.licensePlate}`}
                                    <button onClick={() => handleDeleteVehicle(v.id)}>❌</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Profile Settings</h2>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className={styles.formGroup}>
                            <label>Year:</label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Student ID:</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.actionButton}>
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
