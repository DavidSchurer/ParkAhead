import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, addDoc, collection } from './firebase';
import styles from './Login.module.css';

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleCreateAccount = async () => {
        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
               try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    await addDoc(collection(db, "users"), {
                        uid: user.uid,
                        username: username,
                        email: email
                    });

                    localStorage.setItem('isLoggedIn', 'true');
                    navigate('/Login');
               } catch (error) {
                    setErrorMessage(error.message);
               }
            } else {
                setErrorMessage('Passwords do not match.');
            }
        } else {
            setErrorMessage('Please fill out all of the fields to create an account.');
        }
    };

    return (
        <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
            <h2 className={styles.loginHeader}>Create Account</h2>
            <form>
                <div className={styles.formGroup}>
                    <label>Create Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Enter Email Address:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Create Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Confirm Your Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                </div>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button type="button" className={styles.loginButton} onClick={handleCreateAccount}>
                    Create Account
                </button>
            </form>
        </div>
    </div>
    );
}

export default CreateAccount;