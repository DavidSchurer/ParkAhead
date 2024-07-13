import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import styles from './AddVehicle.module.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUserEmail = async () => {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
            } else {
                navigate('/Login');
            }
        };

        fetchUserEmail();
        }, []);

    const [vehicleInfo, setVehicleInfo] = useState({
        make: '',
        model: '',
        color: '',
        year: '',
        type: '',
        licensePlate: '',
        state: '',
    });

    const [errors, setErrors] = useState({
        make: '',
        model: '',
        color: '',
        year: '',
        type: '',
        licensePlate: '',
        state: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setVehicleInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};

        if (!vehicleInfo.make) {
            newErrors.make = 'Make is required';
        }

        if (!vehicleInfo.model) {
            newErrors.model = 'Model is required';
        }

        if (!vehicleInfo.color) {
            newErrors.color = 'Color is required';
        }

        if (!vehicleInfo.type) {
            newErrors.type = 'Type is required';
        }

        if (!vehicleInfo.year) {
            newErrors.year = 'Year is required';
        } else if (isNaN(vehicleInfo.year)) {
            newErrors.year = 'Year must be a number';
        } else if (vehicleInfo.year < 1900 || vehicleInfo.year > new Date().getFullYear()) {
            newErrors.year = 'Year must be between 1900 and the current year';
        }

        if (!vehicleInfo.licensePlate) {
            newErrors.licensePlate = 'License Plate is required';
        }

        if (!vehicleInfo.state) {
            newErrors.state = 'State is required';
        }

        setErrors(newErrors);

        const user = auth.currentUser;
        const userEmail = user ? user.email : '';

        const vehicleData = {
            ...vehicleInfo,
            userEmail: userEmail,
        };

        if (Object.keys(newErrors).length === 0) {
            try {
                await addDoc(collection(db, 'vehicles'), vehicleData);
                navigate('/HomePage');
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        }
    };

    return (
        <div className={styles.addVehicleContainer}>
            <div className={styles.addVehicleBox}>
            <h2 className={styles.welcomeHeader}>Add Vehicle</h2>
            <form onSubmit={handleSubmit} className={styles.addVehicleForm}>
                <input
                    type="text"
                    name="make"
                    value={vehicleInfo.make}
                    onChange={handleChange}
                    placeholder="Make"
                    className={`${styles.addVehicleInput} ${errors.make ? styles.error : ''}`}
                />
                {errors.make && <div className="error">{errors.make}</div>}

                <input
                    type="text"
                    name="model"
                    value={vehicleInfo.model}
                    onChange={handleChange}
                    placeholder="Model"
                    className={`${styles.addVehicleInput} ${errors.model ? styles.error : ''}`}
                />
                {errors.model && <div className="error">{errors.model}</div>}

                <input
                    type="text"
                    name="color"
                    value={vehicleInfo.color}
                    onChange={handleChange}
                    placeholder="Color"
                    className={`${styles.addVehicleInput} ${errors.color ? styles.error : ''}`}
                />
                {errors.color && <div className="error">{errors.color}</div>}

                <input
                    type="number"
                    name="year"
                    value={vehicleInfo.year}
                    onChange={handleChange}
                    placeholder="Year"
                    className={`${styles.addVehicleInput} ${errors.year ? styles.error : ''}`}
                />
                {errors.year && <div className="error">{errors.year}</div>}

                <input
                    type="text"
                    name="type"
                    value={vehicleInfo.type}
                    onChange={handleChange}
                    placeholder="Type"
                    className={`${styles.addVehicleInput} ${errors.type ? styles.error : ''}`}
                />
                {errors.type && <div className="error">{errors.type}</div>}

                <input
                    type="text"
                    name="licensePlate"
                    value={vehicleInfo.licensePlate}
                    onChange={handleChange}
                    placeholder="License Plate"
                    className={`${styles.addVehicleInput} ${errors.licensePlate ? styles.error : ''}`}
                />
                {errors.licensePlate && <div className="error">{errors.licensePlate}</div>}

                <input
                    type="text"
                    name="state"
                    value={vehicleInfo.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`${styles.addVehicleInput} ${errors.state ? styles.error : ''}`}
                />
                {errors.state && <div className="error">{errors.state}</div>}

                <button type="submit" className={styles.addVehicleButton}>
                    Add Vehicle
                </button>
            </form>
            </div>
        </div>
    );
};

export default AddVehicle;