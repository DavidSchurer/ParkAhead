import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebase';
import styles from './Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberLogin, setRememberLogin] = useState(false);

    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRememberLoginChange = (event) => {
        setRememberLogin(event.target.checked);
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/ReserveParkingSpace');
        } catch (error) {
            alert('Invalid email or password');
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
                        <label>Email:</label>
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
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
