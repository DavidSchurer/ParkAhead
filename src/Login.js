import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberLogin, setRememberLogin] = useState(false);

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberLoginChange = (event) => {
        setRememberLogin(event.target.checked);
    };

    const handleLogin = () => {
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (username === storedUsername && password === storedPassword) {
            // Flag to indicate that the user is logged in
            localStorage.setItem('isLoggedIn', 'true');
            // Direct the user to the Reserve Parking Space page 
            navigate('/ReserveParkingSpace');
        } else {
            // Error message is displayed if the user enters an incorrect username or password
            alert('Invalid username or password.');
        }
    };

    const handleCreateAccount = () => {
        navigate('/CreateAccount');
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.loginHeader}>Login</h2>
                <form>
                    <div className={styles.formGroup}>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberLogin}
                                onChange={handleRememberLoginChange}
                            />
                            Remember me
                        </label>
                    </div>
                    <button type="button" className={styles.loginButton} onClick={handleLogin}>
                        Login
                    </button>
                    <p>Don't have an account?</p>
                    <button type="button" className={styles.createAccountButton} onClick={handleCreateAccount}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;